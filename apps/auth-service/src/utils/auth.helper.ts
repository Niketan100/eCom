import { ValidationError } from "../../../../packages/errorHandler/index";
import redisClient from "@real-app/libs/redis";
import { sendMail } from "./sendMail";


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
        await redisClient.setex(`opt_spam:${email}`, 3600, 'true'); // Block for 1 hour
        throw new ValidationError("Too many OTP requests. Please try again later.");
    }
}