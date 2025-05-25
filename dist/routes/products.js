"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
// Rutas públicas (no requieren autenticación)
router.get("/api/products", products_1.getProducts); // Ver todos los productos
router.get("/api/product/:id", products_1.getProductById); // Ver producto específico
router.get("/api/products/category/:categoryId", products_1.getProductsByCategory); // Productos por categoría
router.get("/api/products/low-stock", products_1.getLowStockProducts); // Stock bajo (admin)
// Rutas protegidas (requieren autenticación)
router.post("/api/product/add", validateToken_1.default, products_1.addProduct); // Crear producto
router.get("/api/my-products", validateToken_1.default, products_1.getMyProducts); // Ver mis productos
router.put("/api/product/:id", validateToken_1.default, products_1.updateMyProduct); // Actualizar mi producto
router.delete("/api/product/:id", validateToken_1.default, products_1.deleteMyProduct); // Eliminar mi producto
router.get("/api/my-products/low-stock", validateToken_1.default, products_1.getMyLowStockProducts); // Mi stock bajo
exports.default = router;
