import { NextFunction, Request, Response } from "express";
import { sendOtp, validateRegistrationData } from "../utils/auth.helper";
import prisma from './../../../../packages/libs/prisma'
import { ForbiddenError } from "@real-app/errorHandler";
import { otpRestrictions, trackOtpRequest } from "../utils/auth.helper";


export const userRegister = async (req : Request , res : Response , next : NextFunction) => {
    validateRegistrationData(req.body);
    
    const { username, email, password } = req.body;

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
    
    const newUser = await prisma.users.create({
        data: {
            name: username,
            email,
            password // Remember to hash the password before saving in a real application
        }
    });
    console.log(`User registered: ${newUser.email} with ID: ${newUser.id}`);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    });
}




export const userLogin = async (req : Request , res : Response , next : NextFunction) => {
    const { email, password } = req.body;

    // Here you would typically check the user's credentials against the database
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    });

    if (!user || user.password !== password) {
        throw new ForbiddenError('Invalid email or password');
    }

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
}