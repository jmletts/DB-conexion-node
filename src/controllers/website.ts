// src/controllers/website.ts
import { Request, Response } from "express";
import { Op } from "sequelize";
import { Company, Product, ProductImage, WebsiteService, User, Category } from "../models";
import { User as UserInterface } from "../interfaces/User";

interface AuthenticatedRequest extends Request {
  user?: UserInterface;
}

// Crear/Activar servicio de website para la empresa
export const createWebsiteService = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;
    const { subdomain, domain, theme = 'default' } = req.body;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    // Verificar que el usuario tiene una empresa
    const company = await Company.findOne({ where: { user_id } });
    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    // Verificar si ya existe un servicio de website
    let websiteService = await WebsiteService.findOne({
      where: { company_id: (company as any).id }
    });

    if (websiteService) {
      res.status(400).json({ msg: "Ya tienes un servicio de website activo" });
      return;
    }

    // Validar que el subdomain no esté en uso
    if (subdomain) {
      const existingSubdomain = await WebsiteService.findOne({
        where: { subdomain }
      });
      if (existingSubdomain) {
        res.status(400).json({ msg: "El subdominio ya está en uso" });
        return;
      }
    }

    // Validar que el domain no esté en uso (si se proporciona)
    if (domain) {
      const existingDomain = await WebsiteService.findOne({
        where: { domain }
      });
      if (existingDomain) {
        res.status(400).json({ msg: "El dominio ya está en uso" });
        return;
      }
    }

    // Generar subdomain automáticamente si no se proporciona
    let finalSubdomain = subdomain;
    if (!finalSubdomain) {
      const companyName = (company as any).name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      finalSubdomain = companyName;
      
      // Verificar unicidad del subdomain generado
      let counter = 1;
      while (await WebsiteService.findOne({ where: { subdomain: finalSubdomain } })) {
        finalSubdomain = `${companyName}-${counter}`;
        counter++;
      }
    }

    // Crear el servicio de website
    websiteService = await WebsiteService.create({
      company_id: (company as any).id,
      domain,
      subdomain: finalSubdomain,
      theme,
      is_active: true,
      ssl_enabled: false
    });

    res.status(201).json({
      msg: "Servicio de website creado exitosamente",
      websiteService,
      publicUrl: domain || `${finalSubdomain}.tusitio.com`
    });

  } catch (error: any) {
    console.error("Error creando servicio de website:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtener información del sitio web público por subdomain
export const getPublicWebsite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subdomain } = req.params;

    if (!subdomain) {
      res.status(400).json({ msg: "Subdominio requerido" });
      return;
    }

    // Buscar el servicio de website
    const websiteService = await WebsiteService.findOne({
      where: { 
        subdomain,
        is_active: true 
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'description', 'email', 'phone', 'address', 'website'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'lastName']
            },
            {
              model: Product,
              as: 'products',
              where: { is_active: true },
              required: false,
              attributes: ['id', 'name', 'description', 'price', 'stock', 'brand'],
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  attributes: ['image_url', 'alt_text', 'is_primary']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!websiteService) {
      res.status(404).json({ msg: "Sitio web no encontrado" });
      return;
    }

    res.json({
      website: websiteService,
      company: (websiteService as any).company
    });

  } catch (error: any) {
    console.error("Error obteniendo sitio web público:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtener productos de un sitio web público
export const getPublicWebsiteProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subdomain } = req.params;
    const { category, search, limit, offset } = req.query;

    if (!subdomain) {
      res.status(400).json({ msg: "Subdominio requerido" });
      return;
    }

    // Buscar el servicio de website
    const websiteService = await WebsiteService.findOne({
      where: { 
        subdomain,
        is_active: true 
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id']
        }
      ]
    });

    if (!websiteService) {
      res.status(404).json({ msg: "Sitio web no encontrado" });
      return;
    }

    const companyId = (websiteService as any).company.id;

    // Construir condiciones de búsqueda
    const whereConditions: any = {
      company_id: companyId,
      is_active: true
    };

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } }
      ];
    }

    const includeConditions: any[] = [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['image_url', 'alt_text', 'is_primary']
      }
    ];

    // Filtro por categoría si se especifica
    if (category) {
      includeConditions.push({
        model: Category,
        as: 'categories',
        where: { id: category },
        attributes: ['id', 'name']
      });
    }

    const products = await Product.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      order: [['created_at', 'DESC']]
    });

    res.json({
      products: products.rows,
      total: products.count,
      hasMore: offset ? (parseInt(offset as string) + (limit ? parseInt(limit as string) : 10)) < products.count : false
    });

  } catch (error: any) {
    console.error("Error obteniendo productos del sitio web:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtener un producto específico del sitio web público
export const getPublicWebsiteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subdomain, productId } = req.params;

    if (!subdomain || !productId) {
      res.status(400).json({ msg: "Subdominio y ID de producto requeridos" });
      return;
    }

    // Buscar el servicio de website
    const websiteService = await WebsiteService.findOne({
      where: { 
        subdomain,
        is_active: true 
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!websiteService) {
      res.status(404).json({ msg: "Sitio web no encontrado" });
      return;
    }

    const companyId = (websiteService as any).company.id;

    // Buscar el producto específico
    const product = await Product.findOne({
      where: {
        id: productId,
        company_id: companyId,
        is_active: true
      },
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['image_url', 'alt_text', 'is_primary', 'display_order'],
          order: [['display_order', 'ASC']]
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!product) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }

    res.json({
      product,
      company: (websiteService as any).company
    });

  } catch (error: any) {
    console.error("Error obteniendo producto del sitio web:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtener mi servicio de website
export const getMyWebsiteService = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    // Verificar que el usuario tiene una empresa
    const company = await Company.findOne({ where: { user_id } });
    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    const websiteService = await WebsiteService.findOne({
      where: { company_id: (company as any).id },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      hasWebsite: !!websiteService,
      websiteService,
      publicUrl: websiteService ? 
        ((websiteService as any).domain || `${(websiteService as any).subdomain}.tusitio.com`) : 
        null
    });

  } catch (error: any) {
    console.error("Error obteniendo servicio de website:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Actualizar configuración del website
export const updateMyWebsiteService = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;
    const updateData = req.body;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    // Verificar que el usuario tiene una empresa
    const company = await Company.findOne({ where: { user_id } });
    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    const websiteService = await WebsiteService.findOne({
      where: { company_id: (company as any).id }
    });

    if (!websiteService) {
      res.status(404).json({ msg: "No tienes un servicio de website" });
      return;
    }

    // Validaciones de unicidad si se están actualizando
    if (updateData.subdomain && updateData.subdomain !== (websiteService as any).subdomain) {
      const existingSubdomain = await WebsiteService.findOne({
        where: {
          subdomain: updateData.subdomain,
          id: { [Op.ne]: (websiteService as any).id }
        }
      });
      if (existingSubdomain) {
        res.status(400).json({ msg: "El subdominio ya está en uso" });
        return;
      }
    }

    if (updateData.domain && updateData.domain !== (websiteService as any).domain) {
      const existingDomain = await WebsiteService.findOne({
        where: {
          domain: updateData.domain,
          id: { [Op.ne]: (websiteService as any).id }
        }
      });
      if (existingDomain) {
        res.status(400).json({ msg: "El dominio ya está en uso" });
        return;
      }
    }

    await websiteService.update(updateData);

    const updatedService = await WebsiteService.findOne({
      where: { company_id: (company as any).id },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      msg: "Servicio de website actualizado exitosamente",
      websiteService: updatedService,
      publicUrl: (updatedService as any).domain || `${(updatedService as any).subdomain}.tusitio.com`
    });

  } catch (error: any) {
    console.error("Error actualizando servicio de website:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};