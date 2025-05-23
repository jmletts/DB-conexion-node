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
exports.updateMyCompany = exports.getMyCompany = exports.checkCompanyExists = exports.desactivateMyCompany = exports.addCompany = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Crear empresa
const addCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, address, phone, email, website, tax_id, } = req.body;
        // Obtener user_id del token JWT
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validaciones básicas
        if (!user_id || !name) {
            res.status(400).json({
                msg: "Los campos user_id y name son obligatorios",
            });
            return;
        }
        // Verificar que el usuario existe
        const user = yield models_1.User.findByPk(user_id);
        if (!user) {
            res.status(404).json({ msg: "Usuario no encontrado" });
            return;
        }
        // Verificar que el usuario no tenga ya una empresa
        const existingCompany = yield models_1.Company.findOne({ where: { user_id } });
        if (existingCompany) {
            res.status(400).json({
                msg: "El usuario ya tiene una empresa asociada",
            });
            return;
        }
        // Verificar email único si se proporciona
        if (email) {
            const existingEmail = yield models_1.Company.findOne({ where: { email } });
            if (existingEmail) {
                res.status(400).json({ msg: "El email ya está en uso" });
                return;
            }
        }
        // Verificar tax_id único si se proporciona
        if (tax_id) {
            const existingTaxId = yield models_1.Company.findOne({ where: { tax_id } });
            if (existingTaxId) {
                res.status(400).json({ msg: "El RFC/Tax ID ya está en uso" });
                return;
            }
        }
        const newCompany = yield models_1.Company.create({
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
    }
    catch (error) {
        console.error("Error creando empresa:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
        });
    }
});
exports.addCompany = addCompany;
// Desactivar empresa (soft delete)
const desactivateMyCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Soft delete - marcar como inactiva
        yield company.update({ is_active: false });
        res.json({ msg: "Empresa desactivada exitosamente" });
    }
    catch (error) {
        console.error("Error desactivando empresa:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.desactivateMyCompany = desactivateMyCompany;
// Verificar si el usuario tiene empresa
const checkCompanyExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        const company = yield models_1.Company.findOne({
            where: { user_id },
            attributes: ["id", "name", "is_active"],
        });
        res.json({
            hasCompany: !!company,
            company: company || null,
        });
    }
    catch (error) {
        console.error("Error verificando empresa:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.checkCompanyExists = checkCompanyExists;
// Obtener empresa del usuario autenticado
const getMyCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        const company = yield models_1.Company.findOne({
            where: { user_id },
            include: [
                {
                    model: models_1.User,
                    as: "user",
                    attributes: ["id", "name", "lastName", "email", "phone", "status"],
                },
                {
                    model: models_1.Product,
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
    }
    catch (error) {
        console.error("Error obteniendo empresa:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.getMyCompany = getMyCompany;
// Actualizar empresa del usuario
const updateMyCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updateData = req.body;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        // Verificar email único si se está actualizando
        if (updateData.email && updateData.email !== company.email) {
            const existingEmail = yield models_1.Company.findOne({
                where: {
                    email: updateData.email,
                    id: { [sequelize_1.Op.ne]: company.id },
                },
            });
            if (existingEmail) {
                res.status(400).json({ msg: "El email ya está en uso" });
                return;
            }
        }
        // Verificar tax_id único si se está actualizando
        if (updateData.tax_id && updateData.tax_id !== company.tax_id) {
            const existingTaxId = yield models_1.Company.findOne({
                where: {
                    tax_id: updateData.tax_id,
                    id: { [sequelize_1.Op.ne]: company.id },
                },
            });
            if (existingTaxId) {
                res.status(400).json({ msg: "El RFC/Tax ID ya está en uso" });
                return;
            }
        }
        yield company.update(updateData);
        // Obtener la empresa actualizada con relaciones
        const updatedCompany = yield models_1.Company.findOne({
            where: { user_id },
            include: [
                {
                    model: models_1.User,
                    as: "user",
                    attributes: ["id", "name", "lastName", "email", "phone"],
                },
            ],
        });
        res.json({
            msg: "Empresa actualizada exitosamente",
            company: updatedCompany,
        });
    }
    catch (error) {
        console.error("Error actualizando empresa:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.updateMyCompany = updateMyCompany;
