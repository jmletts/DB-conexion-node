"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/website.ts
const express_1 = require("express");
const website_1 = require("../controllers/website");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
// ===================================
// RUTAS PÚBLICAS (sin autenticación)
// ===================================
// Obtener información completa del sitio web público
router.get("/public/:subdomain", website_1.getPublicWebsite);
// Obtener productos de un sitio web público
router.get("/public/:subdomain/products", website_1.getPublicWebsiteProducts);
// Obtener un producto específico de un sitio web público
router.get("/public/:subdomain/product/:productId", website_1.getPublicWebsiteProduct);
// ===================================
// RUTAS PRIVADAS (requieren autenticación)
// ===================================
// Crear servicio de website
router.post("/api/website/create", validateToken_1.default, website_1.createWebsiteService);
// Obtener mi servicio de website
router.get("/api/website/my-web", validateToken_1.default, website_1.getMyWebsiteService);
// Actualizar mi servicio de website
router.put("/api/website/update", validateToken_1.default, website_1.updateMyWebsiteService);
exports.default = router;
