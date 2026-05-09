import { Router } from 'express';
import { userLogin, userRegister, verifyUser , forgetPassword , verifyUserForgotPassword, resetUserPassword, refreshToken, getUser } from '../controllers/auth.controller';
import { isAuthanticated } from 'packages/middleware/isAuthanticated';
const router = Router(); 

router.post('/register', userRegister);
router.post('/verify', verifyUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgetPassword);
router.post('/verify-forgot-password', verifyUserForgotPassword);   
router.post('/reset-password', resetUserPassword);   
router.post('/refresh-token', refreshToken);
router.get('/logged-in-user' , isAuthanticated , getUser);
export default router;
