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

export const getInventoryProducts = async (   req: Request, res: Response, next: NextFunction ) => {

   try {
      const seller = (req as any).user

      console.log(seller._id);
      if (!seller) {
         return res.status(401).json({
            message: 'Unauthorized'
         })
      }
      const products = await prisma.products.findMany({

         where: {
            sellerId: seller.id
         },
         select: {
            id: true,
            name: true,
            stock: true,
            price: true,
            category: true,
            salesCount: true,
            isActive: true,
            createdAt: true
         },
         orderBy: {
            createdAt: 'desc'
         }
      })
      console.log('Inventory products for seller', seller.id, products);

      return res.status(200).json({
         success: true,
         count: products.length,
         products
      })
      

   } catch (error) {
      console.error('Error fetching inventory products:', error);
      return next(error)

   }

}

export const getOrders = async(req : Request, res: Response, next: NextFunction) => {
   try{
      const seller = req.user;

      if(!seller){
         return res.status(404).json(
            {
               "Error":"Seller Not Found !"
            }
         )
      }
      const orders = await prisma.orders.findMany({

         where: {
            sellerId: seller.id
         },
         include: {
            product: {
               select: {
                  name: true,
                  price: true
               }
            },
            user: {
               select: {
                  name: true,
                  email: true
               }
            }
         },
         orderBy: {
            createdAt: 'desc'
         }
      })

      return res.status(200).json({
         success: true,
         count: orders.length,
         orders
      })
   }catch(err){
      return next(err);
   }
}

export const getall = async(req: Request, res: Response, next: NextFunction) => {
   try{
      const products = await prisma.products.findMany({
         where: {
            isActive: true
         },
         select: {
            id: true,
            name: true,
            price: true,
            category: true,
            stock: true,
            createdAt: true,
            slug: true
         },
         orderBy: {
            createdAt: 'desc'
         }
      })
      console.log('All active products', products);

      return res.status(200).json({
         success: true,
         count: products.length,
         products
      })
   }catch(err){
      return next(err);
   }
}

export const getsingle = async(req: Request, res: Response, next: NextFunction) => {
   try{
      const {slug} = req.params;
      const product = await prisma.products.findUnique({
         where: {
            slug
         },
         select: {
            id: true,
            name: true,
            price: true,
            category: true,
            stock: true,
            description: true,
            createdAt: true
         }
      })

      if(!product){
         return res.status(404).json({
            message: 'Product not found'
         })
      }

      return res.status(200).json({
         success: true,
         product
      })
   }catch(err){
      return next(err);
   }  
} 


