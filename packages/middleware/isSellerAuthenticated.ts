import { UnauthorizedError } from "@real-app/errorHandler";
import prisma from "./../libs/prisma/index";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Seller-only authentication.
 *
 * Why: When both user + seller cookies exist in the same browser, a generic
 * middleware that tries multiple cookie names can authenticate the wrong role.
 * This middleware ONLY accepts seller cookies / tokens.
 */
const isSellerAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeaderToken = req.headers.authorization?.split(' ')[1];
        const cookieToken = req.cookies?.seller_accessToken;
        const token = authHeaderToken || cookieToken;

        if (!token) {
            return next(new UnauthorizedError('No access token found'));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };

        if (decode.role !== 'seller') {
            return next(new UnauthorizedError('Invalid access token'));
        }

        const seller = await prisma.seller.findUnique({ where: { id: decode.id } });
        if (!seller) return next(new UnauthorizedError('Invalid access token'));

        req.user = seller;
        req.role = 'seller';

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

export default isSellerAuthenticated;
