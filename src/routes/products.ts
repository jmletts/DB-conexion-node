import { Router } from 'express';
import { getProducts, addProduct } from '../controllers/products';
import validateToken from './validateToken';

const router = Router();

router.post("/api/product/register", addProduct)
router.get("/api/product/display",validateToken, getProducts)

export default router;