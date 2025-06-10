import { Router } from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import validateToken from "./validateToken";

const router = Router();

// Todas las rutas de company requieren autenticación
router.post("/api/category/create", validateToken, createCategory);
router.get("/api/category/display", validateToken, getCategories);
router.put("/api/category/update/:id", validateToken, updateCategory);
router.delete("/api/category/delete/:id", validateToken, deleteCategory);

export default router;
 