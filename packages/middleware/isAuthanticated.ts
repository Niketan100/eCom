import { ForbiddenError } from "@real-app/errorHandler";
import prisma from "@real-app/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";


export const isAuthanticated = async(req : any , res : Response , next : NextFunction) => { 
     try{
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

        if(!token){
            throw new ForbiddenError('No Access Token was Found !');
        }
        
        const decode = jwt.verify(token , process.env.JWT_SECRET as string) as {id : string , role : string};

        if(!decode){
            res.status(404).json({"Error" : "Could not Verify the token"});
            throw new ForbiddenError("Error while decoding Token");
        }

        const user_id = decode.id;

        const user = await prisma.users.findUnique({
            where :{
                id : user_id
            },
            select : {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if(!user){
            res.status(404).json({"Error" : "User not Found!"})
            throw new ForbiddenError("User not Found!");
        }

        req.user = user;
        next();
     }catch(err){
        next(err);
     }
}
