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
exports.updateMyWebsiteService = exports.getMyWebsiteService = exports.getPublicWebsiteProduct = exports.getPublicWebsiteProducts = exports.getPublicWebsite = exports.createWebsiteService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Crear/Activar servicio de website para la empresa
const createWebsiteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { subdomain, domain, theme = 'default' } = req.body;
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
        // Verificar si ya existe un servicio de website
        let websiteService = yield models_1.WebsiteService.findOne({
            where: { company_id: company.id }
        });
        if (websiteService) {
            res.status(400).json({ msg: "Ya tienes un servicio de website activo" });
            return;
        }
        // Validar que el subdomain no esté en uso
        if (subdomain) {
            const existingSubdomain = yield models_1.WebsiteService.findOne({
                where: { subdomain }
            });
            if (existingSubdomain) {
                res.status(400).json({ msg: "El subdominio ya está en uso" });
                return;
            }
        }
        // Validar que el domain no esté en uso (si se proporciona)
        if (domain) {
            const existingDomain = yield models_1.WebsiteService.findOne({
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
            const companyName = company.name.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            finalSubdomain = companyName;
            // Verificar unicidad del subdomain generado
            let counter = 1;
            while (yield models_1.WebsiteService.findOne({ where: { subdomain: finalSubdomain } })) {
                finalSubdomain = `${companyName}-${counter}`;
                counter++;
            }
        }
        // Crear el servicio de website
        websiteService = yield models_1.WebsiteService.create({
            company_id: company.id,
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
    }
    catch (error) {
        console.error("Error creando servicio de website:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.createWebsiteService = createWebsiteService;
// Obtener información del sitio web público por subdomain
const getPublicWebsite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subdomain } = req.params;
        if (!subdomain) {
            res.status(400).json({ msg: "Subdominio requerido" });
            return;
        }
        // Buscar el servicio de website
        const websiteService = yield models_1.WebsiteService.findOne({
            where: {
                subdomain,
                is_active: true
            },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name', 'description', 'email', 'phone', 'address', 'website'],
                    include: [
                        {
                            model: models_1.User,
                            as: 'user',
                            attributes: ['name', 'lastName']
                        },
                        {
                            model: models_1.Product,
                            as: 'products',
                            where: { is_active: true },
                            required: false,
                            attributes: ['id', 'name', 'description', 'price', 'stock', 'brand'],
                            include: [
                                {
                                    model: models_1.ProductImage,
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
            company: websiteService.company
        });
    }
    catch (error) {
        console.error("Error obteniendo sitio web público:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.getPublicWebsite = getPublicWebsite;
// Obtener productos de un sitio web público
const getPublicWebsiteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subdomain } = req.params;
        const { category, search, limit, offset } = req.query;
        if (!subdomain) {
            res.status(400).json({ msg: "Subdominio requerido" });
            return;
        }
        // Buscar el servicio de website
        const websiteService = yield models_1.WebsiteService.findOne({
            where: {
                subdomain,
                is_active: true
            },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id']
                }
            ]
        });
        if (!websiteService) {
            res.status(404).json({ msg: "Sitio web no encontrado" });
            return;
        }
        const companyId = websiteService.company.id;
        // Construir condiciones de búsqueda
        const whereConditions = {
            company_id: companyId,
            is_active: true
        };
        if (search) {
            whereConditions[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { description: { [sequelize_1.Op.like]: `%${search}%` } },
                { brand: { [sequelize_1.Op.like]: `%${search}%` } }
            ];
        }
        const includeConditions = [
            {
                model: models_1.ProductImage,
                as: 'images',
                attributes: ['image_url', 'alt_text', 'is_primary']
            }
        ];
        // Filtro por categoría si se especifica
        if (category) {
            includeConditions.push({
                model: models_1.Category,
                as: 'categories',
                where: { id: category },
                attributes: ['id', 'name']
            });
        }
        const products = yield models_1.Product.findAndCountAll({
            where: whereConditions,
            include: includeConditions,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
            order: [['created_at', 'DESC']]
        });
        res.json({
            products: products.rows,
            total: products.count,
            hasMore: offset ? (parseInt(offset) + (limit ? parseInt(limit) : 10)) < products.count : false
        });
    }
    catch (error) {
        console.error("Error obteniendo productos del sitio web:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.getPublicWebsiteProducts = getPublicWebsiteProducts;
// Obtener un producto específico del sitio web público
const getPublicWebsiteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subdomain, productId } = req.params;
        if (!subdomain || !productId) {
            res.status(400).json({ msg: "Subdominio y ID de producto requeridos" });
            return;
        }
        // Buscar el servicio de website
        const websiteService = yield models_1.WebsiteService.findOne({
            where: {
                subdomain,
                is_active: true
            },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ]
        });
        if (!websiteService) {
            res.status(404).json({ msg: "Sitio web no encontrado" });
            return;
        }
        const companyId = websiteService.company.id;
        // Buscar el producto específico
        const product = yield models_1.Product.findOne({
            where: {
                id: productId,
                company_id: companyId,
                is_active: true
            },
            include: [
                {
                    model: models_1.ProductImage,
                    as: 'images',
                    attributes: ['image_url', 'alt_text', 'is_primary', 'display_order'],
                    order: [['display_order', 'ASC']]
                },
                {
                    model: models_1.Category,
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
            company: websiteService.company
        });
    }
    catch (error) {
        console.error("Error obteniendo producto del sitio web:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.getPublicWebsiteProduct = getPublicWebsiteProduct;
// Obtener mi servicio de website
const getMyWebsiteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const websiteService = yield models_1.WebsiteService.findOne({
            where: { company_id: company.id },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name']
                }
            ]
        });
        res.json({
            hasWebsite: !!websiteService,
            websiteService,
            publicUrl: websiteService ?
                (websiteService.domain || `${websiteService.subdomain}.tusitio.com`) :
                null
        });
    }
    catch (error) {
        console.error("Error obteniendo servicio de website:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.getMyWebsiteService = getMyWebsiteService;
// Actualizar configuración del website
const updateMyWebsiteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updateData = req.body;
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
        const websiteService = yield models_1.WebsiteService.findOne({
            where: { company_id: company.id }
        });
        if (!websiteService) {
            res.status(404).json({ msg: "No tienes un servicio de website" });
            return;
        }
        // Validaciones de unicidad si se están actualizando
        if (updateData.subdomain && updateData.subdomain !== websiteService.subdomain) {
            const existingSubdomain = yield models_1.WebsiteService.findOne({
                where: {
                    subdomain: updateData.subdomain,
                    id: { [sequelize_1.Op.ne]: websiteService.id }
                }
            });
            if (existingSubdomain) {
                res.status(400).json({ msg: "El subdominio ya está en uso" });
                return;
            }
        }
        if (updateData.domain && updateData.domain !== websiteService.domain) {
            const existingDomain = yield models_1.WebsiteService.findOne({
                where: {
                    domain: updateData.domain,
                    id: { [sequelize_1.Op.ne]: websiteService.id }
                }
            });
            if (existingDomain) {
                res.status(400).json({ msg: "El dominio ya está en uso" });
                return;
            }
        }
        yield websiteService.update(updateData);
        const updatedService = yield models_1.WebsiteService.findOne({
            where: { company_id: company.id },
            include: [
                {
                    model: models_1.Company,
                    as: 'company',
                    attributes: ['id', 'name']
                }
            ]
        });
        res.json({
            msg: "Servicio de website actualizado exitosamente",
            websiteService: updatedService,
            publicUrl: updatedService.domain || `${updatedService.subdomain}.tusitio.com`
        });
    }
    catch (error) {
        console.error("Error actualizando servicio de website:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.updateMyWebsiteService = updateMyWebsiteService;
