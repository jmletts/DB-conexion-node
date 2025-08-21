"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../controllers/category");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
// Todas las rutas de company requieren autenticación
router.post("/api/category/create", validateToken_1.default, category_1.createCategory);
router.get("/api/category/display", validateToken_1.default, category_1.getCategories);
router.put("/api/category/update", validateToken_1.default, category_1.updateCategory);
router.delete("/api/category/delete/:id", validateToken_1.default, category_1.deleteCategory);
exports.default = router;
