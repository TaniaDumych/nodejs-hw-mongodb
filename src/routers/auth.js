import { Router } from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getContacts } from '../controllers/contacts.js';
import { sendResetEmail } from '../controllers/authController.js';
import { emailSchema } from '../schemas/emailSchema.js';
import validateBody from '../middlewares/validateBody.js';
import { resetPassword } from '../controllers/authController.js';
import { passwordResetSchema } from '../schemas/resetPwdSchema.js';



const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);



router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);
router.post('/reset-password', validateBody(passwordResetSchema), resetPassword);





router.use(authenticate);
router.get('/', getContacts);







export default router;

