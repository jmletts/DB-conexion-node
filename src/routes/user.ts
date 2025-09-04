import { Router } from 'express';
import { login} from '../controllers/user';
import { register } from '../controllers/user';
import { updateUser } from '../controllers/user';

const router = Router();

router.post("/api/user/register", register);
router.post("/api/user/login", login);
router.post("/api/user/update", updateUser);

export default router;