import { NextFunction, Request, Response } from "express";
import { forgotPassword, sendOtp, validateRegistrationData } from "../utils/auth.helper";
import prisma from "@real-app/libs/prisma";
import { ForbiddenError } from "@real-app/errorHandler";
import { otpRestrictions, trackOtpRequest, validateOtp, verifyUserForgotPasswordOtp } from "../utils/auth.helper";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setCookie } from "../utils/cookies/setcookie";



export const userRegister = async (req : Request , res : Response , next : NextFunction) => {
    try {
    validateRegistrationData(req.body);
    
    const { username, email } = req.body;

    const existingUser = await prisma.users.findUnique({
        where: {
            email: email
        }
    });
    if(existingUser){
        throw new ForbiddenError('Email already in use');

    }
    await otpRestrictions(email);
    await trackOtpRequest(email);
    await sendOtp(username, email, 'otpTemplate');
    
    res.status(200).json({
        message: 'OTP sent to email'
    }); 
    } catch (error) {
        next(error);
    }
}

export const verifyUser = async (req : Request , res : Response , next : NextFunction) => {
    try {
    const { email, otp , password , name } = req.body;

    const existingUser = await prisma.users.findUnique({
        where: {
            email: email 
        }
    });

    if(existingUser){
        throw new ForbiddenError('User already exists');
    }

    await validateOtp(email, otp, next);
    const hashed = await bcrypt.hash(password, 10);
    
    await prisma.users.create({
        data: {
            name,
            email,
            password: hashed
        }
    });

    res.status(200).json({
        message: 'User verified successfully'
    });
    } catch (error) {
        next(error);
    }
    
}


export const userLogin = async (req : Request , res : Response , next : NextFunction) => {
    try {
    const { email, password } = req.body;
    // Here you would typically check the user's credentials against the database
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    });
    if(!user){
        throw new ForbiddenError('Invalid email or password');
    }
    const decrypt = await bcrypt.compare(password, user.password || '');

    if (!user || !decrypt) {
        throw new ForbiddenError('Invalid email or password');
    }
    const accessToken = jwt.sign({ id: user.id , role: 'user'}, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user.id , role: 'user'}, process.env.JWT_SECRET as string, { expiresIn: '7d' });

   setCookie(res, 'refreshToken', refreshToken);
   setCookie(res, 'accessToken', accessToken);

   
    
    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const forgetPassword = async (req : Request , res : Response , next : NextFunction) => {
    await forgotPassword(req, res, next, 'user');
}

export const verifyUserForgotPassword = async (req : Request , res : Response , next : NextFunction) => {   
    await verifyUserForgotPasswordOtp(req,res,next, 'user');
}

export const resetUserPassword = async(req : Request , res : Response , next : NextFunction) => {
    try {
        const { email, newPassword } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });
        if(!user){
            throw new ForbiddenError('User not found');
        }

        // await validateOtp(email, otp, () => {
        //     throw new ForbiddenError('Invalid OTP');
        // }); 

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
            where: {
                email: email
            },
            data: {
                password: hashed
            }
        });

        res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
}
     
export const refreshToken = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.cookies.seller_refreshToken || req.headers.authorization?.split(' ')[1];
        if (!refreshToken) {
            throw new ForbiddenError('No refresh token provided');
        }
       
       
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string, role: string };
       

        if (!decoded?.role) {
            throw new ForbiddenError('Unauthorized');
        }

        if (decoded.role === 'user') {
            const user = await prisma.users.findUnique({
                where: {
                    id: decoded.id
                }
            });
            if(!user){
                throw new ForbiddenError('unauthorized not found');
            }

            const newAccessToken = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            const newRefreshToken = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

            // Rotate both tokens so the browser always has a matching pair.
            setCookie(res, 'accessToken', newAccessToken);
            setCookie(res, 'refreshToken', newRefreshToken);
        } else if (decoded.role === 'seller') {
            const seller = await prisma.seller.findUnique({
                where: {
                    id: decoded.id
                }
            });
            if(!seller){
                throw new ForbiddenError('unauthorized not found');
            }

            const newAccessToken = jwt.sign({ id: seller.id, role: 'seller' }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            const newRefreshToken = jwt.sign({ id: seller.id, role: 'seller' }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

            setCookie(res, 'seller_accessToken', newAccessToken);
            setCookie(res, 'seller_refreshToken', newRefreshToken);
        } else {
            throw new ForbiddenError('Unauthorized');
        }

        res.status(200).json({
            message: 'Access token refreshed successfully'
        });

    }catch (error) {
        next(error);
    }
}

export const getUser = async(req : any , res : Response , next : NextFunction) =>{
    const user = req.user;
    const { password, ...safeUser } = user || null;


    res.status(200).json({
        user : safeUser
    });
    next();
}

export const registerSeller = async (req : Request , res : Response , next : NextFunction) => {
    try {
    validateRegistrationData(req.body);
    
    const { name, username, email } = req.body;
    const sellerName = name || username;
    
    const existingSeller = await prisma.seller.findUnique({
        where: {
            email: email
        }
    });
    if(existingSeller){
        throw new ForbiddenError('Email already in use');

    }
    await otpRestrictions(email);
    await trackOtpRequest(email);
    await sendOtp(sellerName, email, 'otpTemplate');
    
    res.status(200).json({
        message: 'OTP sent to email'
    }); 
    } catch (error) {
        next(error);
    }
}

export const verifySellerOtp = async (req : Request , res : Response , next : NextFunction) => {
    try {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ForbiddenError('Email and OTP are required');
    }

    const existingSeller = await prisma.seller.findUnique({
        where: { email }
    });
    if (existingSeller) {
        throw new ForbiddenError('Seller already exists');
    }

    const isValid = await validateOtp(email, otp, next);
    if (!isValid) {
        throw new ForbiddenError('Invalid OTP');
    }

    res.status(200).json({
        message: 'OTP verified successfully'
    });
    } catch (error) {
        next(error);
    }
}

export const createSeller = async (req : Request , res : Response , next : NextFunction) => {
    try {
    const {
        name,
        email,
        phoneNumber,
        country,
        password,
        businessName,
        address,
        city,
        state,
        postalCode
    } = req.body;

    if (!name || !email || !phoneNumber || !country || !password || !businessName || !address || !city || !state || !postalCode) {
        throw new ForbiddenError('All seller fields are required');
    }

    const existingSeller = await prisma.seller.findUnique({
        where: { email }
    });
    if (existingSeller) {
        throw new ForbiddenError('Seller already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const seller = await prisma.seller.create({
        data: {
            name,
            email,
            phoneNumber,
            country,
            password: hashed,
            businessName: businessName,
            address,
            city,
            state,
            postalCode
        }
    });

    res.status(201).json({
        message: 'Seller created successfully',
        seller: {
            id: seller.id,
            name: seller.name,
            email: seller.email
        }
    });
    } catch (error) {
        next(error);
    }
}

export const verifySeller = async (req : Request , res : Response , next : NextFunction) => {
    try {
    const { email, otp  } = req.body;

    const existingSeller = await prisma.seller.findUnique({
        where: {
            email: email 
        }
    });
    if(existingSeller){
        throw new ForbiddenError('Seller already exists');
    }

    await validateOtp(email, otp, next);
   
    res.status(200).json({
        message: 'Seller verified successfully'
    });
    } catch (error) {
        next(error);
    }
    
}   

export const createShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            sellerId,
            name,
            description,
            category,
            openingHours,
            website,
            socialMediaLinks,
            coverImage
        } = req.body;

        if (!sellerId || !name || !description || !category || !openingHours) {
            throw new ForbiddenError('All shop fields are required');
        }

        const seller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });

        if (!seller) {
            throw new ForbiddenError('Seller not found');
        }

        const existingShop = await prisma.shops.findUnique({
            where: { sellerId }
        });

        if (existingShop) {
            throw new ForbiddenError('Shop already exists for this seller');
        }

        const socialLinks = Array.isArray(socialMediaLinks)
            ? socialMediaLinks
            : socialMediaLinks
                ? [socialMediaLinks]
                : [];

        const shop = await prisma.shops.create({
            data: {
                name,
                description,
                category,
                openingHours,
                website,
                coverImage,
                socialMediaLinks: socialLinks,
                sellerId
            }
        });

        await prisma.seller.update({
            where: { id: sellerId },
            data: { shopId: shop.id }
        });

        res.status(201).json({
            message: 'Shop created successfully',
            shop
        });
    } catch (error) {
        next(error);
    }
}

export const stripeConnect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) {
            throw new ForbiddenError('Seller ID is required');
        }

        const seller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });

        if (!seller) {
            throw new ForbiddenError('Seller not found');
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: seller.email,
            business_type: 'individual',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            }
        });

        await prisma.seller.update({
            where: { id: sellerId },
            data: { stripeAccountId: account.id }
        });

        res.status(200).json({
            message: 'Stripe account created successfully',
            stripeAccountId: account.id
        });
    } catch (error) {
        next(error);
    }
}

export const sellerLogin = async (req : Request , res : Response , next : NextFunction) => { 
    try {
    const { email, password } = req.body;
    // Here you would typically check the user's credentials against the database
    const seller = await prisma.seller.findUnique({
        where: {
            email: email
        }
    });
    if(!seller){
        throw new ForbiddenError('Invalid email or password');
    }
    const decrypt = await bcrypt.compare(password, seller.password || '');

    if (!seller || !decrypt) {
        throw new ForbiddenError('Invalid email or password');
    }
    const accessToken = jwt.sign({ id: seller.id , role: 'seller'}, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: seller.id , role: 'seller'}, process.env.JWT_SECRET as string, { expiresIn: '7d' });
   setCookie(res, 'seller_refreshToken', refreshToken);
   setCookie(res, 'seller_accessToken', accessToken);
    
    res.status(200).json({
        message: 'Seller logged in successfully',
        user: {
            id: seller.id,
            name: seller.name,
            email: seller.email
        }
    });
    } catch (error) {
        next(error);
    }
}

export const getSeller = async(req : any , res : Response , next : NextFunction) =>{
    try{
        if (req.role !== 'seller') {
            throw new ForbiddenError('Unauthorized');
        }

        const seller = req.user;

        if(!seller){
            throw new ForbiddenError('Seller not found');
        }

        const shopie = await prisma.shops.findUnique({
            where: {
                sellerId: seller.id
            }
        });

       

        res.status(200).json({
            seller: {
                id: seller.id,
                name: seller.name,
                email: seller.email,
                phoneNumber: seller.phoneNumber,
                country: seller.country,
                businessName: seller.businessName,
                address: seller.address,
                city: seller.city,
                state: seller.state,
                postalCode: seller.postalCode,
                shop : seller.shopId ? shopie : null
            }
        });

    }catch(err){
        next(err);
    }
}


export const getComplaints = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const seller = req.user as any;

        if (!seller?.id) {
            throw new ForbiddenError('Not Authorized');
        }

        const complaints = await prisma.complaints.findMany({
            where: {
                sellerId: seller.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json({
            status: 'good',
            complaints,
        });
    } catch (error) {
        return next(error);
    }
}


export const Userlogout = async (req: Request, res: Response, next: NextFunction) => {  

    try{
       
            res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
       

        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
}


