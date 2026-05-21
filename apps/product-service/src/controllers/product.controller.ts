import prisma from "./../../../../packages/libs/prisma";

import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

export const createProduct = async (

   req: Request,
   res: Response,
   next: NextFunction

) => {

   try {

      const {

         name,
         shortDescription,
         description,
         category,
         brand,
         price,
         discountedPrice,
         stock,
         sku,
         tags,
         highlights,
         features,
         variants,
         shippingWeight,
         warranty

      } = req.body

      // required validation

      if (
         !name ||
         !description ||
         !price ||
         !stock ||
         !category
      ) {

         return res.status(400).json({

            success: false,

            message:
               'Required fields missing'

         })

      }

      const seller = (req as any).user

      if (!seller) {

         return res.status(401).json({

            success: false,

            message: 'Unauthorized'

         })

      }

      const slug = slugify(name, {

         lower: true,

         strict: true

      })

      const existingProduct =
         await prisma.products.findUnique({

            where: {
               slug
            }

         })

      if (existingProduct) {

         return res.status(400).json({

            success: false,

            message:
               'Product with same slug already exists'

         })

      }

      const shopId = seller.shopId

      // create product

      const newProduct =
         await prisma.products.create({

            data: {

               name,

               slug,

               shortDescription,

               description,

               category,

               brand,

               price: Number(price),

               discountedPrice:
                  discountedPrice
                     ? Number(
                          discountedPrice
                       )
                     : null,

               stock: Number(stock),

               sku,

               tags: tags || [],

               highlights:
                  highlights || [],

               features:
                  features || [],

               shippingWeight,

               warranty,

               sellerId: seller.id,

               shopId

            }

         })

      // create variants separately

      if (
         variants &&
         Array.isArray(variants) &&
         variants.length > 0
      ) {

         await prisma.productVariants.createMany({

            data: variants.map(
               (variant: any) => ({

                  productId:
                     newProduct.id,

                  type:
                     variant.type,

                  value:
                     variant.value,

                  stock:
                     Number(
                        variant.stock
                     ) || 0,

                  additionalPrice:
                     Number(
                        variant.additionalPrice
                     ) || 0

               })
            )

         })

      }

      return res.status(201).json({

         success: true,

         message:
            'Product created successfully',

         product: newProduct

      })

   } catch (error) {

      console.log(
         'Create product error:',
         error
      )

      return next(error)

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
            slug: true,
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

export const getSellerPayments = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;

      if (!seller) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized',
         });
      }

      const payments = await prisma.payments.findMany({
         where: {
            order: {
               sellerId: seller.id,
            },
         },
         include: {
            order: {
               include: {
                  product: {
                     select: {
                        id: true,
                        name: true,
                        price: true,
                     },
                  },
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                     },
                  },
               },
            },
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      return res.status(200).json({
         success: true,
         count: payments.length,
         payments,
      });
   } catch (err) {
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
      const {id} = req.params;
      const product = await prisma.products.findUnique({
         where: {
            id
         },
         select: {
            id: true,
            name: true,
            slug: true,
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

export const getsingleBySlug = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {

   try {

      const { slug } = req.params

      const product =
         await prisma.products.findUnique({

            where: {
               slug
            },

            include: {

               // product images
               images: true,

               // variants
               variants: true,

               // reviews with user
               reviews: {
                  include: {
                     user: {
                        select: {
                           id: true,
                           name: true,
                           email: true
                        }
                     }
                  },
                  orderBy: {
                     createdAt: 'desc'
                  }
               },

               // seller info
               seller: {
                  select: {
                     id: true,
                     name: true,
                     email: true
                  }
               },

               // shop info
               shop: {
                  select: {
                     id: true,
                     name: true,
                     description: true,
                     createdAt: true
                  }
               }

            }

         })

      if (!product) {

         return res.status(404).json({

            success: false,

            message: 'Product not found'

         })

      }

      // increase views
      await prisma.products.update({

         where: {
            id: product.id
         },

         data: {
            views: {
               increment: 1
            }
         }

      })

      return res.status(200).json({

         success: true,

         product

      })

   } catch (err) {

      console.log(
         'Get single product error:',
         err
      )

      return next(err)

   }

}


export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {

   try {
      const { id } = req.params;
      const {
         name,
         description,
         price,
         stock,
         category
      } = req.body;

      const seller = (req as any).user;

      if (!seller) {
         return res.status(401).json({
            message: 'Unauthorized'
         });
      }

      const existingProduct = await prisma.products.findUnique({
         where: {
            id
         }
      });

      if (!existingProduct) {
         return res.status(404).json({
            message: 'Product not found'
         });
      }

      if (existingProduct.sellerId !== seller.id) {
         return res.status(403).json({
            message: 'Forbidden'
         });
      }

      const slug = slugify(name, {
         lower: true,
         strict: true
      });

      const updatedProduct = await prisma.products.update({
         where: {
            id
         },
         data: {
            name,
            slug,
            description,
            price: Number(price),
            stock: Number(stock),
            category
         }
      });
        console.log('Product updated successfully:', updatedProduct);  

      return res.status(200).json({
         message: 'Product updated successfully',
         product: updatedProduct
      });
    
   } catch (error) {
      console.log('Error updating product:', error);
      return next(error);
   }
}  


export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { productId, variantId, quantity, address } = req.body;
      const user = (req as any).user;

      if (!user) {
         return res.status(401).json({
            message: 'Unauthorized'
         });
      }

      if (!productId || !address) {
         return res.status(400).json({ message: 'productId and address are required' });
      }

      const qty = Number(quantity);
      if (!qty || qty <= 0) {
         return res.status(400).json({ message: 'quantity must be a positive number' });
      }

      // Fetch product with the minimum data needed for order placement.
      const product = await prisma.products.findUnique({
         where: { id: productId },
         select: {
            id: true,
            price: true,
            discountedPrice: true,
            stock: true,
            sellerId: true,
            variants: true,
         }
      });

      if (!product) {
         return res.status(404).json({ message: 'Product not found' });
      }

      // Determine pricing and stock source.
      let unitPrice = Number(product.discountedPrice ?? product.price);
      let stockField: 'product' | 'variant' = 'product';

      if (variantId) {
         const foundVariant = Array.isArray(product.variants)
            ? (product.variants as any[]).find((v) => v?.id === variantId)
            : null;

         if (!foundVariant) {
            return res.status(404).json({ message: 'Variant not found' });
         }

         if (Number(foundVariant.stock ?? 0) < qty) {
            return res.status(400).json({ message: 'Insufficient variant stock' });
         }

         // If your variant has additionalPrice, apply it.
         if (foundVariant?.additionalPrice != null) {
            unitPrice += Number(foundVariant.additionalPrice);
         }

         stockField = 'variant';

         // Decrement variant stock (variant is a separate model in schema, but here variants are stored on product;
         // adjust below if you actually use productVariants model).
         await prisma.products.update({
            where: { id: productId },
            data: {
               variants: {
                  updateMany: {
                     where: { id: variantId },
                     data: { stock: { decrement: qty } },
                  },
               },
            } as any,
         });
      } else {
         if (Number(product.stock ?? 0) < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
         }

         await prisma.products.update({
            where: { id: productId },
            data: { stock: { decrement: qty } },
         });
      }

      const total = unitPrice * qty;

      // Create the order first.
      const order = await prisma.orders.create({
         data: {
            productId,
            userId: user.id,
            sellerId: product.sellerId,
            quantity: qty,
            totalPrice: total,
            shippingAddress: String(address),
         },
      });

      // Cash on delivery: payment is PENDING until delivered/collected.
      const payment = await prisma.payments.create({
         data: {
            orderId: order.id,
            paymentMethod: 'COD',
            amount: total,
            status: 'PENDING',
         },
      });

      return res.status(201).json({
         message: 'Order placed successfully',
         order,
         payment,
         meta: { stockSource: stockField },
      });
   } catch (error) {
      console.log('Error placing order:', error);
      return next(error);
   }
}
