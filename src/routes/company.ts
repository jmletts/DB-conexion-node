import { Router } from 'express';
import { 
  addCompany, 
  getMyCompany, 
  updateMyCompany, 
  desactivateMyCompany, 
  checkCompanyExists 
} from '../controllers/company';
import validateToken from './validateToken';

const router = Router();

// Todas las rutas de company requieren autenticación
router.post("/api/company/add", validateToken, addCompany);
router.get("/api/company/display", validateToken, getMyCompany);
router.put("/api/company/update", validateToken, updateMyCompany);
router.delete("/api/company/deactivate", validateToken, desactivateMyCompany);
router.get("/api/company/check", validateToken, checkCompanyExists);

export default router;