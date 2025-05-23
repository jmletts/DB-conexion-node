import { Request, Response } from "express";
import { Op } from "sequelize";
import { Company, User, Product } from "../models";
import { User as UserInterface } from "../interfaces/User";

// Extender Request para incluir user
interface AuthenticatedRequest extends Request {
  user?: UserInterface;
}

// Crear empresa
export const addCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
    
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      tax_id,
    } = req.body;

    // Obtener user_id del token JWT
    const user_id = req.user?.id;

    // Validaciones básicas
    if (!user_id || !name) {
      res.status(400).json({
        msg: "Los campos user_id y name son obligatorios",
      });
      return;
    }

    // Verificar que el usuario existe
    const user = await User.findByPk(user_id);
    if (!user) {
      res.status(404).json({ msg: "Usuario no encontrado" });
      return;
    }

    // Verificar que el usuario no tenga ya una empresa
    const existingCompany = await Company.findOne({ where: { user_id } });
    if (existingCompany) {
      res.status(400).json({
        msg: "El usuario ya tiene una empresa asociada",
      });
      return;
    }

    // Verificar email único si se proporciona
    if (email) {
      const existingEmail = await Company.findOne({ where: { email } });
      if (existingEmail) {
        res.status(400).json({ msg: "El email ya está en uso" });
        return;
      }
    }

    // Verificar tax_id único si se proporciona
    if (tax_id) {
      const existingTaxId = await Company.findOne({ where: { tax_id } });
      if (existingTaxId) {
        res.status(400).json({ msg: "El RFC/Tax ID ya está en uso" });
        return;
      }
    }

    const newCompany = await Company.create({
      user_id,
      name,
      description,
      address,
      phone,
      email,
      website,
      tax_id,
      is_active: true,
    });

    res.status(201).json({
      msg: "Empresa creada exitosamente",
      company: newCompany,
    });
  } catch (error: any) {
    console.error("Error creando empresa:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Desactivar empresa (soft delete)
export const desactivateMyCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    const company = await Company.findOne({ where: { user_id } });

    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    // Soft delete - marcar como inactiva
    await company.update({ is_active: false });

    res.json({ msg: "Empresa desactivada exitosamente" });
  } catch (error: any) {
    console.error("Error desactivando empresa:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verificar si el usuario tiene empresa
export const checkCompanyExists = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    const company = await Company.findOne({
      where: { user_id },
      attributes: ["id", "name", "is_active"],
    });

    res.json({
      hasCompany: !!company,
      company: company || null,
    });
  } catch (error: any) {
    console.error("Error verificando empresa:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtener empresa del usuario autenticado
export const getMyCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    const company = await Company.findOne({
      where: { user_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastName", "email", "phone", "status"],
        },
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "stock", "is_active"],
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    res.json({ company });
  } catch (error: any) {
    console.error("Error obteniendo empresa:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Actualizar empresa del usuario
export const updateMyCompany = async (
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

    const company = await Company.findOne({ where: { user_id } });

    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    // Verificar email único si se está actualizando
    if (updateData.email && updateData.email !== (company as any).email) {
      const existingEmail = await Company.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: (company as any).id },
        },
      });

      if (existingEmail) {
        res.status(400).json({ msg: "El email ya está en uso" });
        return;
      }
    }

    // Verificar tax_id único si se está actualizando
    if (updateData.tax_id && updateData.tax_id !== (company as any).tax_id) {
      const existingTaxId = await Company.findOne({
        where: {
          tax_id: updateData.tax_id,
          id: { [Op.ne]: (company as any).id },
        },
      });

      if (existingTaxId) {
        res.status(400).json({ msg: "El RFC/Tax ID ya está en uso" });
        return;
      }
    }

    await company.update(updateData);

    // Obtener la empresa actualizada con relaciones
    const updatedCompany = await Company.findOne({
      where: { user_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastName", "email", "phone"],
        },
      ],
    });

    res.json({
      msg: "Empresa actualizada exitosamente",
      company: updatedCompany,
    });
  } catch (error: any) {
    console.error("Error actualizando empresa:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};