import { Router } from 'express';
import { 
  getProducts, 
  addProduct, 
  getProductById,
  updateMyProduct,
  deleteMyProduct,
  getMyProducts,
  getMyLowStockProducts,
  getLowStockProducts,
  getProductsByCategory
} from '../controllers/products';
import validateToken from './validateToken';

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get("/api/products", getProducts); // Ver todos los productos
router.get("/api/product/:id", getProductById); // Ver producto específico
router.get("/api/products/category/:categoryId", getProductsByCategory); // Productos por categoría
router.get("/api/products/low-stock", getLowStockProducts); // Stock bajo (admin)

// Rutas protegidas (requieren autenticación)
router.post("/api/product/add", validateToken, addProduct); // Crear producto
router.get("/api/my-products", validateToken, getMyProducts); // Ver mis productos
router.put("/api/product/:id", validateToken, updateMyProduct); // Actualizar mi producto
router.delete("/api/product/:id", validateToken, deleteMyProduct); // Eliminar mi producto
router.get("/api/my-products/low-stock", validateToken, getMyLowStockProducts); // Mi stock bajo

export default router;