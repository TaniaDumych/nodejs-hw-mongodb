import { Router } from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getContacts } from '../controllers/contacts.js';


const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.use(authenticate);
router.get('/', getContacts);

export default router;

