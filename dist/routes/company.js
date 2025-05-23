"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_1 = require("../controllers/company");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
// Todas las rutas de company requieren autenticación
router.post("/api/company/add", validateToken_1.default, company_1.addCompany);
router.get("/api/company/display", validateToken_1.default, company_1.getMyCompany);
router.put("/api/company/update", validateToken_1.default, company_1.updateMyCompany);
router.delete("/api/company/deactivate", validateToken_1.default, company_1.desactivateMyCompany);
router.get("/api/company/check", validateToken_1.default, company_1.checkCompanyExists);
exports.default = router;
