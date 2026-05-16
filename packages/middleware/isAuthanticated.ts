
import { UnauthorizedError } from "@real-app/errorHandler";
import prisma from "./../libs/prisma/index";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";


const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new UnauthorizedError('No access token found'));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };

        if (decode.role === 'user') {
            const user = await prisma.users.findUnique({ where: { id: decode.id } });
            if (!user) return next(new UnauthorizedError('Invalid access token'));
            req.user = user;
            req.role = 'user';

        } else if (decode.role === 'seller') {
            const seller = await prisma.seller.findUnique({ where: { id: decode.id } });
            if (!seller) return next(new UnauthorizedError('Invalid access token'));
            req.user = seller;
            req.role = 'seller';

        } else {
            return next(new UnauthorizedError('Invalid access token'));
        }

        next();

    } catch (err) {
        // ✅ JWT errors mapped to 401 so interceptor triggers refresh
        if (err instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('Token expired'));
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError('Invalid token'));
        }
        next(err); // anything else → 500 is fine
    }
};
export default isAuthenticated;