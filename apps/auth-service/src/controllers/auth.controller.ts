import { NextFunction, Request, Response } from "express";
import { forgotPassword, sendOtp, validateRegistrationData } from "../utils/auth.helper";
import prisma from './../../../../packages/libs/prisma'
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
    const accessToken = jwt.sign({ id: user.id , role: 'user'}, process.env.JWT_SECRET as string, { expiresIn: '15m' });
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
        const { email, otp, newPassword } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });
        if(!user){
            throw new ForbiddenError('User not found');
        }

        await validateOtp(email, otp, () => {
            throw new ForbiddenError('Invalid OTP');
        }); 

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
     
