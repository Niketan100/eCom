import { NextFunction , Request , Response } from "express";
import { ForbiddenError } from "@real-app/errorHandler";


const isSeller = async (req : Request , res : Response , next : NextFunction) => {
    try{
        
        const User = req.user as any;
        if(User.role !== 'seller'){
            res.status(403).json({"Error" : "Forbidden Access !"});
            throw new ForbiddenError("Forbidden Access !");
        }
        next();
    }catch(err){
        next(err);
    }
}
export { isSeller };