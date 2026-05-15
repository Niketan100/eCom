import { Router } from 'express';
import { userLogin, userRegister, verifyUser , forgetPassword , verifyUserForgotPassword, resetUserPassword, refreshToken, getUser, registerSeller, verifySellerOtp, createSeller, createShop, stripeConnect, sellerLogin, getSeller } from '../controllers/auth.controller';
import isAuthanticated from 'packages/middleware/isAuthanticated';

const router = Router(); 

router.post('/register', userRegister);
router.post('/verify', verifyUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgetPassword);
router.post('/verify-forgot-password', verifyUserForgotPassword);   
router.post('/reset-password', resetUserPassword);   
router.post('/refresh-token', refreshToken);
router.get('/logged-in-user' , isAuthanticated , getUser);
router.post('/register-seller', registerSeller);
router.post('/verify-seller-otp', verifySellerOtp);
router.post('/create-seller', createSeller);
router.post('/create-shop', createShop);
router.post('/stripe-connect', stripeConnect);
router.post('/seller-login', sellerLogin);
router.get('/logged-in-seller' , isAuthanticated , getSeller);
export default router;
