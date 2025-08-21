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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByCategory = exports.getLowStockProducts = exports.getMyLowStockProducts = exports.deleteMyProduct = exports.updateMyProduct = exports.getProductById = exports.getProducts = exports.getMyProducts = exports.addProduct = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const models_1 = require("../models");
// Crear producto
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, price, cost_price, sku, stock, min_stock, brand, weight, dimensions, is_active } = req.body;
        // Obtener user_id del token JWT
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validaciones básicas
        if (!user_id || !name || !price) {
            res.status(400).json({
                msg: "Los campos name y price son obligatorios"
            });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        // Verificar SKU único si se proporciona
        if (sku) {
            const existingSku = yield models_1.Product.findOne({ where: { sku } });
            if (existingSku) {
                res.status(400).json({ msg: "El SKU ya existe" });
                return;
            }
        }
        const newProduct = yield models_1.Product.create({
            company_id: company.id,
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
    }
    catch (error) {
        console.error("Error creando producto:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.addProduct = addProduct;
// Obtener productos del usuario autenticado
const getMyProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        const products = yield models_1.Product.findAll({
            where: {
                company_id: company.id,
                is_active: true
            },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: models_1.ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'alt_text', 'is_primary']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json({ products });
    }
    catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({
            msg: "Error obteniendo productos",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getMyProducts = getMyProducts;
// Obtener todos los productos (público)
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield models_1.Product.findAll({
            where: { is_active: true },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: models_1.ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'alt_text', 'is_primary']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({
            msg: "Error obteniendo productos",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getProducts = getProducts;
// Obtener producto por ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ msg: "ID de producto inválido" });
            return;
        }
        const product = yield models_1.Product.findByPk(id, {
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: models_1.ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'alt_text', 'is_primary', 'display_order'],
                    order: [['display_order', 'ASC']]
                },
                {
                    model: models_1.Category,
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
    }
    catch (error) {
        console.error("Error obteniendo producto:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getProductById = getProductById;
// Actualizar producto del usuario autenticado
const updateMyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(400).json({ msg: "ID de producto inválido" });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        // Verificar que el producto pertenece a la empresa del usuario
        const product = yield models_1.Product.findOne({
            where: {
                id: id,
                company_id: company.id
            }
        });
        if (!product) {
            res.status(404).json({ msg: "Producto no encontrado o no tienes permisos para editarlo" });
            return;
        }
        // Verificar SKU único si se está actualizando
        if (updateData.sku && updateData.sku !== product.sku) {
            const existingSku = yield models_1.Product.findOne({
                where: {
                    sku: updateData.sku,
                    id: { [sequelize_1.Op.ne]: id }
                }
            });
            if (existingSku) {
                res.status(400).json({ msg: "El SKU ya existe" });
                return;
            }
        }
        yield product.update(updateData);
        // Obtener el producto actualizado con relaciones
        const updatedProduct = yield models_1.Product.findByPk(id, {
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: models_1.ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'alt_text', 'is_primary']
                }
            ]
        });
        res.json({
            msg: "Producto actualizado exitosamente",
            product: updatedProduct
        });
    }
    catch (error) {
        console.error("Error actualizando producto:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.updateMyProduct = updateMyProduct;
// Eliminar producto del usuario autenticado (soft delete)
const deleteMyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ msg: "ID de producto inválido" });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        // Verificar que el producto pertenece a la empresa del usuario
        const product = yield models_1.Product.findOne({
            where: {
                id: id,
                company_id: company.id
            }
        });
        if (!product) {
            res.status(404).json({ msg: "Producto no encontrado o no tienes permisos para eliminarlo" });
            return;
        }
        // Soft delete - marcar como inactivo
        yield product.update({ is_active: false });
        res.json({ msg: "Producto eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error eliminando producto:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.deleteMyProduct = deleteMyProduct;
// Obtener productos con stock bajo del usuario autenticado
const getMyLowStockProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            res.status(401).json({ msg: "Usuario no autenticado" });
            return;
        }
        // Verificar que el usuario tiene una empresa
        const company = yield models_1.Company.findOne({ where: { user_id } });
        if (!company) {
            res.status(404).json({ msg: "No tienes una empresa registrada" });
            return;
        }
        const lowStockProducts = yield models_1.Product.findAll({
            where: {
                company_id: company.id,
                is_active: true,
                [sequelize_1.Op.or]: [
                    { stock: { [sequelize_1.Op.lte]: connection_1.default.col('min_stock') } },
                    { stock: { [sequelize_1.Op.eq]: 0 } }
                ]
            },
            include: [
                {
                    model: models_1.Company,
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
    }
    catch (error) {
        console.error("Error obteniendo productos con stock bajo:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getMyLowStockProducts = getMyLowStockProducts;
// Obtener todos los productos con stock bajo (admin)
const getLowStockProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company_id } = req.query;
        const whereConditions = {
            is_active: true
        };
        if (company_id) {
            whereConditions.company_id = company_id;
        }
        const lowStockProducts = yield models_1.Product.findAll({
            where: Object.assign(Object.assign({}, whereConditions), { [sequelize_1.Op.or]: [
                    { stock: { [sequelize_1.Op.lte]: connection_1.default.col('min_stock') } },
                    { stock: { [sequelize_1.Op.eq]: 0 } }
                ] }),
            include: [
                {
                    model: models_1.Company,
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
    }
    catch (error) {
        console.error("Error obteniendo productos con stock bajo:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getLowStockProducts = getLowStockProducts;
// Buscar productos por categoría
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        if (!categoryId || isNaN(Number(categoryId))) {
            res.status(400).json({ msg: "ID de categoría inválido" });
            return;
        }
        const products = yield models_1.Product.findAll({
            include: [
                {
                    model: models_1.Category,
                    as: 'categories',
                    where: { id: categoryId },
                    attributes: ['id', 'name']
                },
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: models_1.ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'alt_text', 'is_primary']
                }
            ],
            where: { is_active: true },
            order: [['created_at', 'DESC']]
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error obteniendo productos por categoría:", error);
        res.status(500).json({
            msg: "Error obteniendo productos por categoría",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getProductsByCategory = getProductsByCategory;
