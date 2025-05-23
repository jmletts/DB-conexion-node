import { Request, Response } from "express";
import { Op } from "sequelize";
import sequelize from "../database/connection";
import { Product, Company, ProductImage, Category } from "../models";

// Crear producto
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      company_id,
      name, 
      description, 
      price, 
      cost_price, 
      sku, 
      stock, 
      min_stock, 
      brand, 
      weight, 
      dimensions, 
      is_active 
    } = req.body;

    // Validaciones básicas
    if (!company_id || !name || !price) {
      res.status(400).json({ 
        msg: "Los campos company_id, name y price son obligatorios" 
      });
      return;
    }

    // Verificar que la compañía existe
    const company = await Company.findByPk(company_id);
    if (!company) {
      res.status(404).json({ msg: "Compañía no encontrada" });
      return;
    }

    // Verificar SKU único si se proporciona
    if (sku) {
      const existingSku = await Product.findOne({ where: { sku } });
      if (existingSku) {
        res.status(400).json({ msg: "El SKU ya existe" });
        return;
      }
    }

    const newProduct = await Product.create({
      company_id,
      name,
      description,
      price,
      cost_price,
      sku,
      stock: stock || 0,
      min_stock: min_stock || 5,
      brand,
      weight,
      dimensions,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ 
      msg: "Producto creado exitosamente", 
      product: newProduct 
    });

  } catch (error: any) {
    console.error("Error creando producto:", error);
    res.status(500).json({ 
      msg: "Error interno del servidor", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll({
      where: { is_active: true },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image_url', 'alt_text', 'is_primary']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(products);

  } catch (error: any) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ 
      msg: "Error obteniendo productos", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ msg: "ID de producto inválido" });
      return;
    }

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image_url', 'alt_text', 'is_primary', 'display_order'],
          order: [['display_order', 'ASC']]
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!product) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }

    res.json({ product });

  } catch (error: any) {
    console.error("Error obteniendo producto:", error);
    res.status(500).json({ 
      msg: "Error interno del servidor", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ msg: "ID de producto inválido" });
      return;
    }

    const product = await Product.findByPk(id);
    
    if (!product) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }

    // Verificar SKU único si se está actualizando
    if (updateData.sku && updateData.sku !== (product as any).sku) {
      const existingSku = await Product.findOne({ 
        where: { 
          sku: updateData.sku,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingSku) {
        res.status(400).json({ msg: "El SKU ya existe" });
        return;
      }
    }

    await product.update(updateData);
    
    // Obtener el producto actualizado con relaciones
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image_url', 'alt_text', 'is_primary']
        }
      ]
    });

    res.json({ 
      msg: "Producto actualizado exitosamente", 
      product: updatedProduct 
    });

  } catch (error: any) {
    console.error("Error actualizando producto:", error);
    res.status(500).json({ 
      msg: "Error interno del servidor", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Eliminar producto (soft delete)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ msg: "ID de producto inválido" });
      return;
    }

    const product = await Product.findByPk(id);
    
    if (!product) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }

    // Soft delete - marcar como inactivo
    await product.update({ is_active: false });

    res.json({ msg: "Producto eliminado exitosamente" });

  } catch (error: any) {
    console.error("Error eliminando producto:", error);
    res.status(500).json({ 
      msg: "Error interno del servidor", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Obtener productos con stock bajo
export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company_id } = req.query;
    
    const whereConditions: any = {
      is_active: true
    };
    
    if (company_id) {
      whereConditions.company_id = company_id;
    }

    const lowStockProducts = await Product.findAll({
      where: {
        ...whereConditions,
        [Op.or]: [
          { stock: { [Op.lte]: sequelize.col('min_stock') } },
          { stock: { [Op.eq]: 0 } }
        ]
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        }
      ],
      order: [['stock', 'ASC']]
    });

    res.json({ 
      products: lowStockProducts,
      count: lowStockProducts.length 
    });

  } catch (error: any) {
    console.error("Error obteniendo productos con stock bajo:", error);
    res.status(500).json({ 
      msg: "Error interno del servidor", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Buscar productos por categoría
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || isNaN(Number(categoryId))) {
      res.status(400).json({ msg: "ID de categoría inválido" });
      return;
    }

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'categories',
          where: { id: categoryId },
          attributes: ['id', 'name']
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image_url', 'alt_text', 'is_primary']
        }
      ],
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });

    res.json(products);

  } catch (error: any) {
    console.error("Error obteniendo productos por categoría:", error);
    res.status(500).json({ 
      msg: "Error obteniendo productos por categoría", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};