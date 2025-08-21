"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Crear producto
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, is_active } = req.body;
        // Obtener user_id del token JWT
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validaciones básicas
        if (!user_id || !name) {
            res.status(400).json({
                msg: "Los campos name son obligatorios",
            });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        const newCategory = yield models_1.Category.create({
            company_id: company.id,
            name,
            description,
            is_active: is_active !== undefined ? is_active : true,
        });
        res.status(201).json({
            msg: "Categoria creado exitosamente",
            status: newCategory,
        });
    }
    catch (error) {
        console.error("Error creando categoria:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        const categories = yield models_1.Category.findAll({
            where: {
                company_id: company.id,
                is_active: true,
            },
            include: [
                {
                    model: models_1.Category,
                    as: "parent",
                    attributes: ["id", "name", "description", "is_active"],
                },
                {
                    model: models_1.Category,
                    as: "subcategories",
                    attributes: ["id", "name", "description", "is_active"],
                },
                {
                    model: models_1.Company,
                    as: "company",
                    attributes: ["id", "name"],
                },
            ],
            order: [["created_at", "DESC"]],
        });
        res.json(categories);
    }
    catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({
            msg: "Error obteniendo categorias",
        });
    }
});
exports.getCategories = getCategories;
//actualizar el update pero con is desde el rq body
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.body;
        const updateData = req.body;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ msg: "ID de categoria inválido" });
            return;
        }
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        const category = yield models_1.Category.findOne({
            where: {
                id: Number(id),
                company_id: company.id,
            },
        });
        if (!category) {
            res.status(404).json({ msg: "Categoria no encontrada" });
            return;
        }
        if (updateData.sku && updateData.sku !== category.sku) {
            const existingID = yield models_1.Category.findOne({
                where: {
                    sku: updateData.sku,
                    id: { [sequelize_1.Op.ne]: id },
                },
            });
            if (existingID) {
                res.status(400).json({ msg: "El SKU ya existe" });
                return;
            }
        }
        yield category.update(updateData);
        const updatedCategory = yield models_1.Category.findByPk(id, {
            include: [
                {
                    model: models_1.Category,
                    as: "Catgeory",
                    attributes: ["id", "name", "description", "is_active"],
                },
                {
                    model: models_1.Company,
                    as: "company",
                    attributes: ["id", "name"],
                },
            ],
        });
        res.json({
            msg: "Categoria actualizada exitosamente",
            category: updatedCategory,
        });
    }
    catch (error) {
        console.error("Error actualizando categoria:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ msg: "ID de categoria inválido" });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        // Verificar que el producto pertenece a la empresa del usuario
        const category = yield models_1.Category.findOne({
            where: {
                id: id,
                company_id: company.id,
            },
        });
        if (!category) {
            res.status(404).json({
                msg: "categroia no encontrado o no tienes permisos para eliminarlo",
            });
            return;
        }
        // Soft delete - marcar como inactivo
        //await category.update({ is_active: false });
        yield category.destroy();
        res.json({ msg: "categoria eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error eliminando categoria:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.deleteCategory = deleteCategory;
