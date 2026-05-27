import { UnauthorizedError } from "@real-app/errorHandler";
import prisma from "./../libs/prisma/index";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * User-only authentication.
 *
 * Only accepts the user cookie pair: `accessToken` / `refreshToken`.
 */
const isUserAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeaderToken = req.headers.authorization?.split(' ')[1];
        const cookieToken = req.cookies?.accessToken;
        const token = authHeaderToken || cookieToken;

        if (!token) {
            return next(new UnauthorizedError('No access token found'));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };

        if (decode.role !== 'user') {
            return next(new UnauthorizedError('Invalid access token'));
        }

        const user = await prisma.users.findUnique({ where: { id: decode.id } });
        if (!user) return next(new UnauthorizedError('Invalid access token'));

        req.user = user;
        req.role = 'user';

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('Token expired'));
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError('Invalid token'));
        }
        next(err);
    }
};

export default isUserAuthenticated;
