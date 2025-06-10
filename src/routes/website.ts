// src/routes/website.ts
import { Router } from 'express';
import { 
  createWebsiteService,
  getMyWebsiteService,
  updateMyWebsiteService,
  getPublicWebsite,
  getPublicWebsiteProducts,
  getPublicWebsiteProduct
} from '../controllers/website';
import validateToken from './validateToken';
 
const router = Router();

// ===================================
// RUTAS PÚBLICAS (sin autenticación)
// ===================================

// Obtener información completa del sitio web público
router.get("/public/:subdomain", getPublicWebsite);

// Obtener productos de un sitio web público
router.get("/public/:subdomain/products", getPublicWebsiteProducts);

// Obtener un producto específico de un sitio web público
router.get("/public/:subdomain/product/:productId", getPublicWebsiteProduct);

// ===================================
// RUTAS PRIVADAS (requieren autenticación)
// ===================================

// Crear servicio de website
router.post("/api/website/create", validateToken, createWebsiteService);

// Obtener mi servicio de website
router.get("/api/website/my-web", validateToken, getMyWebsiteService);

// Actualizar mi servicio de website
router.put("/api/website/update", validateToken, updateMyWebsiteService);

export default router;