import prisma from "./../../../../packages/libs/prisma";

import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

export const createProduct = async ( req: Request, res: Response, next: NextFunction) => {

   try {
      const {
         name,
         description,
         price,
         stock,
         category
      } = req.body;
      if (
         !name || !description || !price || !stock || !category ) {

         return res.status(400).json({
            message: 'All fields are required'
         });
      }
      const seller = (req as any).user;

      if (!seller) {
         return res.status(401).json({
            message: 'Unauthorized'
         });

      }
      const slug = slugify(name, {
         lower: true,
         strict: true
      });

      const shopId = seller.shopId;
      const newProduct = await prisma.products.create({
         data: {
            name,
            slug,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            sellerId: seller.id,
            shopId,
            tags: []
         }
      });

      return res.status(201).json({
         message: 'Product created successfully',
         product: newProduct
      });

   } catch (error) {
      return next(error);
   }
}