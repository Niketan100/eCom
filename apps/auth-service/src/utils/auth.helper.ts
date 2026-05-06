import { ForbiddenError, ValidationError } from "../../../../packages/errorHandler/index";
import redisClient from "@real-app/libs/redis";
import { sendMail } from "./sendMail";
import { NextFunction } from "express";
import { Request, Response } from "express";
import prisma from "@real-app/libs/prisma";


export const validateRegistrationData = (data: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { username, email, password , phoneNumber, country } = data;

    if(!username || !email || !password) {
        throw new ValidationError("Username, email, and password are required.");
    }

    if (!phoneNumber || !country || !username) {
        throw new ValidationError("Phone number, country, and username are required.");
    }
    if (!emailRegex.test(email)) {
        throw new ValidationError("Invalid email format.");
    }
     
    return { valid: true };
};

export const otpRestrictions = async (email : string) =>{
        if(await redisClient.get(`otp_lock:${email}`)){
            throw new ValidationError("Please wait before requesting another OTP.");
        }

        if(await redisClient.get(`opt_spam:${email}`)){
            throw new ValidationError("Too many OTP requests. Please try again later.");
        }

        if(await redisClient.get(`otp_cooldown:${email}`)){
            throw new ValidationError("Please wait before requesting another OTP.");
        }
}

export const sendOtp = async(name :string , email : string , template : string) =>{
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendMail(email, 'Your OTP Code', template, { name, otp });

    await redisClient.setex(`otp:${email}`, 300, otp); // OTP valid for 5 minutes
    await redisClient.setex(`otp_cooldown:${email}`, 60, 'true'); // Cooldown of 1 minute before requesting another OTP



    // Here you would typically send the OTP to the user's email using an email service
    console.log(`Sending OTP ${otp} to ${email} using template ${template}`);
}

export const trackOtpRequest = async (email : string) =>{
    const otpCount = await redisClient.incr(`otp_count:${email}`);
    if (otpCount === 1) {
        await redisClient.expire(`otp_count:${email}`, 3600); // Reset count after 1 hour
    }
    if (otpCount > 5) {
        await redisClient.setex(`otp_spam:${email}`, 3600, 'true'); // Block for 1 hour
        throw new ValidationError("Too many OTP requests. Please try again later.");
    }
}

export const validateOtp = async (email : string , otp : string , next : NextFunction) =>{
    const storedOtp = await redisClient.get(`otp:${email}`);

    const attempts = await redisClient.incr(`otp_attempts:${email}`);
    if (attempts === 1) {
        await redisClient.expire(`otp_attempts:${email}`, 3600); // Reset attempts after 1 hour
    }
     
    if (storedOtp === otp) {
        await redisClient.del(`otp:${email}`); // Invalidate OTP after successful verification
        return true;
    }else{
        if(attempts >=2){
            await redisClient.set(`otp_lock:${email}`, 3600);
            await redisClient.del(`otp:${email}`);
            return next(
                new ValidationError("Acount Locked for 1 hour"));
        }
        return false;
    }
}

export const forgotPassword = async (req : Request , res : Response , next : NextFunction, role : 'user' | 'seller') => {
    try {  
    const { email } = req.body;
    if(!email){
        throw new ForbiddenError('Email is required');
    }
    const user = role === 'user' && await prisma.users.findUnique({
        where: {
            email: email
        }
    });
    if(!user){
        throw new ForbiddenError('User not found');
    }

    await otpRestrictions(email);
    await trackOtpRequest(email);
    await sendOtp(user.name, email, 'forgotPasswordTemplate');
    
    res.status(200).json({
        message: 'OTP sent to email'
    });
    } catch (error) {
        next(error);
    }
}

export const verifyUserForgotPasswordOtp = async(req : Request , res : Response , next : NextFunction , role : 'user' | 'seller') => {
    try {
    const { email, otp } = req.body;
    if(!email || !otp){
        throw new ForbiddenError('Email and OTP are required');
    }
    const user = role === 'user' && await prisma.users.findUnique({
        where: {
            email: email
        }
    });
    if(!user){
        throw new ForbiddenError('User not found');
    }

    const isValid = await validateOtp(email, otp, next);
    if(!isValid){
        throw new ValidationError('Invalid OTP');
    }

    res.status(200).json({
        message: 'OTP verified successfully'
    });
    } catch (error) {
        next(error);
    }
}