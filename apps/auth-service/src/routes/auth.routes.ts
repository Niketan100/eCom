import { Router } from 'express';
import { userLogin, userRegister, verifyUser , forgetPassword , verifyUserForgotPassword, resetUserPassword } from '../controllers/auth.controller';



const router = Router();

router.post('/register', userRegister);
router.post('/verify', verifyUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgetPassword);
router.post('/verify-forgot-password', verifyUserForgotPassword);   
router.post('/reset-password', resetUserPassword);   

export default router;

