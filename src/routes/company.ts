import { Router } from 'express';
import { addCompany, getMyCompany } from '../controllers/company';
import validateToken from './validateToken';

const router = Router();

router.post("/api/company/add", addCompany)
router.get("/api/company/display",validateToken, getMyCompany)

export default router;