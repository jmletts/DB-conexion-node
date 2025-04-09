import { Router } from 'express';
import { getProducts, registerProduct } from '../controllers/products';
import validateToken from './validateToken';

const router = Router();

router.post("/api/product/register", registerProduct)
router.get("/api/product/display",validateToken, getProducts)

export default router;