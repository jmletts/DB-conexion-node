import { Router } from 'express';
import { registerProduct } from '../controllers/products';

const router = Router();

router.post("/api/product/register", registerProduct)

export default router;