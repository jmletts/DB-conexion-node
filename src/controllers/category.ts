import { Request, Response } from "express";
import { Op } from "sequelize";
import { Company, Category } from "../models";
import { User as UserInterface } from "../interfaces/User";

// Extender Request para incluir user
interface AuthenticatedRequest extends Request {
  user?: UserInterface;
}

// Crear producto
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, is_active } = req.body;

    // Obtener user_id del token JWT
    const user_id = req.user?.id;

    // Validaciones básicas
    if (!user_id || !name) {
      res.status(400).json({
        msg: "Los campos name son obligatorios",
      });
      return;
    }

    // Verificar que el usuario tiene una empresa
    const company = await Company.findOne({ where: { user_id } });
    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    const newCategory = await Category.create({
      company_id: (company as any).id,
      name,
      description,
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(201).json({
      msg: "Categoria creado exitosamente",
      status: newCategory,
    });
  } catch (error: any) {
    console.error("Error creando categoria:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getCategories = async (
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

    const categories = await Category.findAll({
      where: {
        company_id: (company as any).id,
        is_active: true,
      },
      include: [
        {
          model: Category,
          as: "parent",
          attributes: ["id", "name", "description", "is_active"],
        },
        {
          model: Category,
          as: "subcategories",
          attributes: ["id", "name", "description", "is_active"],
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(categories);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({
      msg: "Error obteniendo categorias",
    });
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ msg: "ID de categoria inválido" });
      return;
    }

    const company = await Company.findOne({ where: { user_id } });
    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    const category = await Category.findOne({
      where: {
        id: Number(id),
        company_id: (company as any).id,
      },
    });

    if (!category) {
      res.status(404).json({ msg: "Categoria no encontrada" });
      return;
    }

    if (updateData.sku && updateData.sku !== (category as any).sku) {
      const existingID = await Category.findOne({
        where: {
          sku: updateData.sku,
          id: { [Op.ne]: id },
        },
      });

      if (existingID) {
        res.status(400).json({ msg: "El SKU ya existe" });
        return;
      }
    }

    await category.update(updateData);

    const updatedCategory = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: "Catgeory",
          attributes: ["id", "name", "description", "is_active"],
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "name"],
        },
      ],
    });

    res.json({
      msg: "Categoria actualizada exitosamente",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error actualizando categoria:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ msg: "Usuario no autenticado" });
      return;
    }

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ msg: "ID de categoria inválido" });
      return;
    }

    // Verificar que el usuario tiene una empresa
    const company = await Company.findOne({ where: { user_id } });
    if (!company) {
      res.status(404).json({ msg: "No tienes una empresa registrada" });
      return;
    }

    // Verificar que el producto pertenece a la empresa del usuario
    const category = await Category.findOne({
      where: {
        id: id,
        company_id: (company as any).id,
      },
    });

    if (!category) {
      res.status(404).json({
        msg: "categroia no encontrado o no tienes permisos para eliminarlo",
      });
      return;
    }

    // Soft delete - marcar como inactivo
    await category.update({ is_active: false });

    res.json({ msg: "categoria eliminado exitosamente" });
  } catch (error: any) {
    console.error("Error eliminando categoria:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
