import prisma from "./../../../../packages/libs/prisma";

import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

const isValidObjectId = (value: unknown) => /^[a-f0-9]{24}$/i.test(String(value || ''));

const parsePagination = (req: Request, opts?: { defaultLimit?: number; maxLimit?: number }) => {
   const defaultLimit = opts?.defaultLimit ?? 20;
   const maxLimit = opts?.maxLimit ?? 50;

   const pageRaw = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page;
   const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

   const page = Math.max(1, Number(pageRaw ?? 1) || 1);
   const limit = Math.min(maxLimit, Math.max(1, Number(limitRaw ?? defaultLimit) || defaultLimit));
   const skip = (page - 1) * limit;

   return { page, limit, skip };
};

const buildPaginationMeta = (args: { page: number; limit: number; total: number }) => {
   const totalPages = Math.max(1, Math.ceil(args.total / args.limit));
   return {
      page: args.page,
      limit: args.limit,
      total: args.total,
      totalPages,
      hasPrev: args.page > 1,
      hasNext: args.page < totalPages,
   };
};

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

         subcategory,
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

               // Optional for now; only persist if the schema supports it.
               subcategory,

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
      const { page, limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 50 });

      const where = {
         sellerId: seller.id
      } as const;

      const [total, products] = await Promise.all([
         prisma.products.count({ where }),
         prisma.products.findMany({

            where,
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
            },
            skip,
            take: limit,
         }),
      ]);
      console.log('Inventory products for seller', seller.id, products);

      return res.status(200).json({
         success: true,
         count: products.length,
         total,
         meta: buildPaginationMeta({ page, limit, total }),
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
      const { page, limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 50 });

      const where = {
         sellerId: seller.id
      } as const;

      const [total, orders] = await Promise.all([
         prisma.orders.count({ where }),
         prisma.orders.findMany({
            where,
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
            },
            skip,
            take: limit,
         }),
      ]);

      return res.status(200).json({
         success: true,
         count: orders.length,
         total,
         meta: buildPaginationMeta({ page, limit, total }),
         orders
      })
   }catch(err){
      return next(err);
   }
}

export const getOrderByIdForSeller = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;
      const { id } = req.params;

      if (!seller?.id) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!isValidObjectId(id)) {
         return res.status(400).json({ success: false, message: 'Invalid order id' });
      }

      const order = await prisma.orders.findFirst({
         where: { id, sellerId: seller.id },
         include: {
            product: {
               select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  discountedPrice: true,
               },
            },
            user: {
               select: {
                  id: true,
                  name: true,
                  email: true,
               },
            },
            payment: true,
         },
      });

      if (!order) {
         return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.status(200).json({ success: true, order });
   } catch (err) {
      return next(err);
   }
};

export const updateOrderStatusForSeller = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;
      const { id } = req.params;
      const { status } = req.body as { status?: string };

      if (!seller?.id) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!isValidObjectId(id)) {
         return res.status(400).json({ success: false, message: 'Invalid order id' });
      }

      const nextStatus = String(status || '').toUpperCase();
      const allowed = ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
      if (!allowed.includes(nextStatus as any)) {
         return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const existing = await prisma.orders.findFirst({ where: { id, sellerId: seller.id } });
      if (!existing) {
         return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // basic transition rules
      const current = String(existing.status || '').toUpperCase();
      const transitions: Record<string, string[]> = {
         PENDING: ['CONFIRMED', 'CANCELLED'],
         CONFIRMED: ['SHIPPED', 'CANCELLED'],
         SHIPPED: ['DELIVERED'],
         DELIVERED: [],
         CANCELLED: [],
      };

      if (!(transitions[current] || []).includes(nextStatus)) {
         return res.status(400).json({
            success: false,
            message: `Invalid status transition: ${current} -> ${nextStatus}`,
         });
      }

      const updated = await prisma.orders.update({
         where: { id },
         data: { status: nextStatus as any },
         include: {
            product: {
               select: { id: true, name: true, slug: true, price: true, discountedPrice: true },
            },
            user: { select: { id: true, name: true, email: true } },
            payment: true,
         },
      });

      return res.status(200).json({ success: true, message: 'Order updated', order: updated });
   } catch (err) {
      return next(err);
   }
};

export const getSellerPayments = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;

      if (!seller) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized',
         });
      }

      const { page, limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 50 });

      const where = {
         order: {
            sellerId: seller.id,
         },
      } as const;

      const [total, payments] = await Promise.all([
         prisma.payments.count({ where }),
         prisma.payments.findMany({
         where,
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
         skip,
         take: limit,
      }),
      ]);

      return res.status(200).json({
         success: true,
         count: payments.length,
         total,
         meta: buildPaginationMeta({ page, limit, total }),
         payments,
      });
   } catch (err) {
      return next(err);
   }
}

export const getSellerPaymentById = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;

      if (!seller) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const id = String(req.params.id || '').trim();
      if (!id) {
         return res.status(400).json({ success: false, message: 'Payment id is required' });
      }

      const payment = await prisma.payments.findFirst({
         where: {
            id,
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
                        slug: true,
                        price: true,
                        discountedPrice: true,
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
      });

      if (!payment) {
         return res.status(404).json({ success: false, message: 'Payment not found' });
      }

      return res.status(200).json({ success: true, payment });
   } catch (err) {
      return next(err);
   }
}
export const getall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, skip } = parsePagination(req, {
      defaultLimit: 20,
      maxLimit: 50,
    });

    const {
      search,
      categories,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
    } = req.query;

    const where: any = {
      isActive: true,
    };

    // Search
    if (search) {
      where.OR = [
        {
          name: {
            contains: String(search),
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: String(search),
            mode: 'insensitive',
          },
        },
        {
          category: {
            contains: String(search),
            mode: 'insensitive',
          },
        },
      ];
    }

    // Categories
    if (categories) {
      const categoryArray = String(categories)
        .split(',')
        .map((c) => c.trim());

      where.category = {
        in: categoryArray,
      };
    }

    // Stock
    if (inStock === 'true') {
      where.stock = {
        gt: 0,
      };
    }

    // Price
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = Number(minPrice);
      }

      if (maxPrice) {
        where.price.lte = Number(maxPrice);
      }
    }

    let orderBy: any = {
      createdAt: 'desc',
    };

    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;

      case 'price-desc':
        orderBy = { price: 'desc' };
        break;

      case 'name-asc':
        orderBy = { name: 'asc' };
        break;

      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.products.count({ where }),

      prisma.products.findMany({
        where,
        orderBy,
        skip,
        take: limit,

        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          discountedPrice: true,
          category: true,
          stock: true,
          slug: true,
          createdAt: true,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      total,
      count: products.length,
      meta: buildPaginationMeta({
        page,
        limit,
        total,
      }),
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getsingle = async(req: Request, res: Response, next: NextFunction) => {
   try{
      const {id} = req.params;

      // Prisma MongoDB expects @db.ObjectId strings for id fields.
      // If a route collision happens (e.g. "/user-orders" accidentally hits "/:id"),
      // Prisma will throw: "Malformed ObjectID ... got: 'user-orders'".
      // Validate early so we return a clean 400 instead of a Prisma runtime error.
      if (!/^[a-f0-9]{24}$/i.test(String(id))) {
         return res.status(400).json({
            success: false,
            message: 'Invalid product id'
         })
      }

      const product = await prisma.products.findUnique({
         where: {
            id
         },
         select: { 
            id: true,
            name: true,
            slug: true,
            price: true,
            subcategory : true,
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

            select: {
               id: true,
               name: true,
               slug: true,
               shortDescription: true,
               description: true,
               category: true,
               subcategory: true,
               brand: true,
               price: true,
               discountedPrice: true,
               stock: true,
               tags: true,
               shippingWeight: true,
               warranty: true,
               isFeatured: true,
               averageRating: true,
               reviewCount: true,
               createdAt: true,

               // relations
               images: true,
               variants: true,
               reviews: {
                  include: {
                     user: {
                        select: {
                           id: true,
                           name: true,
                           email: true,
                        },
                     },
                  },
                  orderBy: {
                     createdAt: 'desc',
                  },
               },
               seller: {
                  select: {
                     id: true,
                     name: true,
                     email: true,
                  },
               },
               shop: {
                  select: {
                     id: true,
                     name: true,
                     description: true,
                     createdAt: true,
                  },
               },
            },

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

      // Seller notifications: PRODUCT_VIEWED (rate-limited)
      // Uses existing products.views and checks the last notification time to avoid spamming.
      // Notes: Prisma Client might not be regenerated yet in this repo, so we use safe delegate fallbacks.
      try {
         const notificationDelegate = (prisma as any).notification ?? (prisma as any).Notification

         if (notificationDelegate && product?.seller?.id) {
            const now = new Date()
            const throttleMs = 1000 * 60 * 60 // 1 hour

            const last = await notificationDelegate.findFirst({
               where: {
                  sellerId: product.seller.id,
                  type: 'PRODUCT_VIEWED',
                  // data is JSON; Prisma Mongo supports path filters, but to stay compatible we keep this simple
                  // and only throttle per seller for PRODUCT_VIEWED if JSON path filters aren't available.
               },
               orderBy: {
                  createdAt: 'desc',
               },
               select: {
                  createdAt: true,
               },
            })

            const lastAt = last?.createdAt ? new Date(last.createdAt) : null
            const shouldNotify = !lastAt || now.getTime() - lastAt.getTime() >= throttleMs

            if (shouldNotify) {
               // Get the new views count (already incremented just above)
               const updated = await prisma.products.findUnique({
                  where: { id: product.id },
                  select: { views: true },
               })

               const views = (updated as any)?.views ?? null

               await notificationDelegate.create({
                  data: {
                     // receiver
                     toSellerId: product.seller.id,
                     sellerId: product.seller.id,
                     // sender unknown for anonymous product views
                     fromUserId: null,
                     fromSellerId: null,

                     type: 'PRODUCT_VIEWED',
                     title: 'Product viewed',
                     message: `${product.name} was viewed${typeof views === 'number' ? ` (${views} total views)` : ''}.`,
                     data: {
                        productId: product.id,
                        slug: product.slug,
                        views,
                     },
                     readAt: null,
                  },
               })
            }
         }
      } catch (e) {
         console.log('Product view notification error:', e)
      }

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

      // Seller notification: new order
      try {
         const notificationClient = (prisma as any).notification ?? (prisma as any).Notification;
         await notificationClient?.create?.({
            data: {
               // receiver
               toSellerId: product.sellerId,
               sellerId: product.sellerId,
               // sender (the user who placed the order)
               fromUserId: user.id,
               fromSellerId: null,
               type: 'ORDER_CREATED',
               title: 'New order received',
               message: `Order ${order.id} created for ${qty} item(s).`,
               data: {
                  orderId: order.id,
                  productId,
                  quantity: qty,
                  total,
               },
            },
         } as any);
      } catch {
         // don't block checkout if notifications fail
      }

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

export const placeCartOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, address } = req.body;

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!items?.length) {
      return res.status(400).json({
        message: 'No items provided'
      });
    }

    const orders = [];

    for (const item of items) {
      const product =
        await prisma.products.findUnique({
          where: {
            id: item.productId
          }
        });

      if (!product) {
        continue;
      }

      if (product.stock < item.quantity) {
        continue;
      }

      const totalPrice =
        Number(
          product.discountedPrice ??
          product.price
        ) * item.quantity;

      await prisma.products.update({
        where: {
          id: product.id
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });

      const order =
        await prisma.orders.create({
          data: {
            productId: product.id,
            sellerId: product.sellerId,
            userId: user.id,
            quantity: item.quantity,
            totalPrice,
            shippingAddress: address
          }
        });

      await prisma.payments.create({
        data: {
          orderId: order.id,
          paymentMethod: 'COD',
          amount: totalPrice,
          status: 'PENDING'
        }
      });

      orders.push(order);
    }

    return res.status(201).json({
      message: 'Orders created',
      orders
    });

  } catch (error) {
    next(error);
  }
};

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;
      if (!seller) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const notificationClient = (prisma as any).notification ?? (prisma as any).Notification;
      if (!notificationClient) {
         return res.status(501).json({ success: false, message: 'Notifications not available (Prisma client not regenerated yet)' });
      }

      const { page, limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 50 });
      const [total, notifications] = await Promise.all([
         notificationClient.count({ where: { sellerId: seller.id } } as any),
         notificationClient.findMany({
            where: { sellerId: seller.id } as any,
            orderBy: { createdAt: 'desc' } as any,
            skip,
            take: limit,
         } as any),
      ]);

      return res.status(200).json({
         success: true,
         total,
         meta: buildPaginationMeta({ page, limit, total }),
         notifications,
      });
   } catch (err) {
      return next(err);
   }
};

export const getMyUnreadNotificationCount = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;
      if (!seller) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const notificationClient = (prisma as any).notification ?? (prisma as any).Notification;
      if (!notificationClient) {
         return res.status(501).json({ success: false, message: 'Notifications not available (Prisma client not regenerated yet)' });
      }

      const count = await notificationClient.count({
         where: { sellerId: seller.id, readAt: null } as any,
      } as any);

      return res.status(200).json({ success: true, count });
   } catch (err) {
      return next(err);
   }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;
      if (!seller) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const notificationClient = (prisma as any).notification ?? (prisma as any).Notification;
      if (!notificationClient) {
         return res.status(501).json({ success: false, message: 'Notifications not available (Prisma client not regenerated yet)' });
      }

      const id = String(req.params.id || '').trim();
      if (!id) return res.status(400).json({ success: false, message: 'Notification id is required' });

      // Only allow marking seller's own notification
      const updated = await notificationClient.update({
         where: { id } as any,
         data: { readAt: new Date() } as any,
      } as any);

      if ((updated as any)?.sellerId && (updated as any).sellerId !== seller.id) {
         return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      return res.status(200).json({ success: true, notification: updated });
   } catch (err) {
      return next(err);
   }
};

export const markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const seller = (req as any).user;
      if (!seller) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const notificationClient = (prisma as any).notification ?? (prisma as any).Notification;
      if (!notificationClient) {
         return res.status(501).json({ success: false, message: 'Notifications not available (Prisma client not regenerated yet)' });
      }

      const result = await notificationClient.updateMany({
         where: { sellerId: seller.id, readAt: null } as any,
         data: { readAt: new Date() } as any,
      } as any);

      return res.status(200).json({ success: true, updated: result?.count ?? 0 });
   } catch (err) {
      return next(err);
   }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const config = await prisma.site_config.findFirst();

      if(!config){
         return res.status(404).json({
            "message" : "Configuration Not Found "
         })
      }
      return res.status(200).json({
         success: true,
         categories: config.categories,
         subcategories: config.subcategories
      })
      
   } catch (error) {
      console.log('Error fetching categories:', error);
      return next(error);
   }
}


export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
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

      // Prisma (MongoDB) doesn't automatically cascade deletes.
      // Delete dependent records first to avoid required relation violations.
      await prisma.$transaction(async (tx) => {
         // Order matters: delete children → parent.
         await tx.productVariants.deleteMany({
            where: { productId: id },
         });

         await tx.productImages.deleteMany({
            where: { productId: id },
         });

         await tx.productReviews.deleteMany({
            where: { productId: id },
         });

         await tx.cartItems.deleteMany({
            where: { productId: id },
         });

         await tx.wishlist.deleteMany({
            where: { productId: id },
         });

         // If orders exist, product deletion can also fail due to required order->product relation.
         // Payments depend on orders, so delete payments first.
         const orderIds = await tx.orders.findMany({
            where: { productId: id },
            select: { id: true },
         });
         const orderIdList = orderIds.map((o) => o.id);

         if (orderIdList.length > 0) {
            await tx.payments.deleteMany({
               where: { orderId: { in: orderIdList } },
            });
            await tx.orders.deleteMany({
               where: { id: { in: orderIdList } },
            });
         }

         await tx.products.delete({
            where: { id },
         });
      });

      return res.status(200).json({
         message: 'Product deleted successfully'
      });
    
   } catch (error) {
      console.log('Error deleting product:', error);
      return next(error);
   }
}


export const getUserOrders = async(req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;

      if (!user) {
         return res.status(401).json({
            message: 'Unauthorized'
         });
      }

      // defensive logging to help debug missing orders / malformed ids
      console.log('getUserOrders: incoming user:', {
         id: user?.id,
         email: user?.email,
         role: (req as any).role,
      });

      // basic validation: user.id should be a non-empty string
      if (!user.id || typeof user.id !== 'string' || user.id.trim().length === 0) {
         console.log('getUserOrders: invalid user id, aborting');
         return res.status(400).json({ success: false, message: 'Invalid user id' });
      }

      const orders = await prisma.orders.findMany({
         where: {
            userId: user.id
         },
         include: {
            product: {
               select: {
                  id: true,
                  name: true,
                  price: true,
                  discountedPrice: true,
                  images: {
                     select: {
                        url: true,
                     },
                     take: 1,
                  },
               }
            },
            payment: true,
            seller: {
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
      });

   console.log('getUserOrders: found orders count =', orders?.length ?? 0);

      return res.status(200).json({
         success: true,
         orders
      });
   } catch (error) {
      console.log('Error fetching user orders:', error && (error as any).message ? (error as any).message : error);

      // Handle malformed ObjectId errors explicitly (Prisma/Mongo)
      const msg = (error as any)?.message || '';
      if (/Malformed ObjectID|provided hex string representation must be exactly 12 bytes/i.test(msg)) {
         return res.status(400).json({ success: false, message: 'Invalid user id format' });
      }

      return next(error);
   }  
}

/*
|--------------------------------------------------------------------------
| CART + WISHLIST (USER)
|--------------------------------------------------------------------------
*/

export const getMyWishlist = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const items = await prisma.wishlist.findMany({
         where: { userId: user.id },
         include: {
            product: {
               select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  discountedPrice: true,
                  category: true,
                  subcategory: true,
                  stock: true,
                  createdAt: true,
               }
            }
         },
         orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json({ success: true, count: items.length, items });
   } catch (err) {
      return next(err);
   }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      const { productId } = req.body as { productId?: string };

      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!productId || !isValidObjectId(productId)) {
         return res.status(400).json({ success: false, message: 'Invalid productId' });
      }

      const exists = await prisma.wishlist.findFirst({
         where: { userId: user.id, productId }
      });

      if (exists) {
         return res.status(200).json({ success: true, message: 'Already in wishlist' });
      }

      await prisma.wishlist.create({
         data: { userId: user.id, productId }
      });

      return res.status(201).json({ success: true, message: 'Added to wishlist' });
   } catch (err) {
      return next(err);
   }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      const { productId } = req.params;

      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!productId || !isValidObjectId(productId)) {
         return res.status(400).json({ success: false, message: 'Invalid productId' });
      }

      await prisma.wishlist.deleteMany({
         where: { userId: user.id, productId }
      });

      return res.status(200).json({ success: true, message: 'Removed from wishlist' });
   } catch (err) {
      return next(err);
   }
};

export const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const items = await prisma.cartItems.findMany({
         where: { userId: user.id },
         include: {
            product: {
               select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  discountedPrice: true,
                  category: true,
                  subcategory: true,
                  stock: true,
               }
            }
         },
         orderBy: { createdAt: 'desc' }
      });

      const totals = items.reduce(
         (acc, item) => {
            const unitPrice = (item.product as any)?.discountedPrice ?? (item.product as any)?.price ?? 0;
            const qty = Number(item.quantity || 1);
            acc.quantity += qty;
            acc.subtotal += Number(unitPrice) * qty;
            return acc;
         },
         { quantity: 0, subtotal: 0 }
      );

      return res.status(200).json({ success: true, count: items.length, items, totals });
   } catch (err) {
      return next(err);
   }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      const { productId, quantity } = req.body as { productId?: string; quantity?: number };

      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!productId || !isValidObjectId(productId)) {
         return res.status(400).json({ success: false, message: 'Invalid productId' });
      }

      const qty = Math.max(1, Math.min(999, Number(quantity ?? 1)));

      const product = await prisma.products.findUnique({ where: { id: productId }, select: { id: true, stock: true } });
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      const existing = await prisma.cartItems.findFirst({ where: { userId: user.id, productId } });
      if (existing) {
         const nextQty = Math.max(1, Math.min(999, (existing.quantity || 1) + qty));
         await prisma.cartItems.update({ where: { id: existing.id }, data: { quantity: nextQty } });
         return res.status(200).json({ success: true, message: 'Cart updated' });
      }

      await prisma.cartItems.create({ data: { userId: user.id, productId, quantity: qty } });
      return res.status(201).json({ success: true, message: 'Added to cart' });
   } catch (err) {
      return next(err);
   }
};

export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      const { productId } = req.params;
      const { quantity } = req.body as { quantity?: number };

      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!productId || !isValidObjectId(productId)) {
         return res.status(400).json({ success: false, message: 'Invalid productId' });
      }

      const qty = Number(quantity);
      if (!Number.isFinite(qty)) {
         return res.status(400).json({ success: false, message: 'Invalid quantity' });
      }

      if (qty <= 0) {
         await prisma.cartItems.deleteMany({ where: { userId: user.id, productId } });
         return res.status(200).json({ success: true, message: 'Removed from cart' });
      }

      const existing = await prisma.cartItems.findFirst({ where: { userId: user.id, productId } });
      if (!existing) return res.status(404).json({ success: false, message: 'Cart item not found' });

      await prisma.cartItems.update({ where: { id: existing.id }, data: { quantity: Math.min(999, qty) } });
      return res.status(200).json({ success: true, message: 'Quantity updated' });
   } catch (err) {
      return next(err);
   }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      const { productId } = req.params;

      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!productId || !isValidObjectId(productId)) {
         return res.status(400).json({ success: false, message: 'Invalid productId' });
      }

      await prisma.cartItems.deleteMany({ where: { userId: user.id, productId } });
      return res.status(200).json({ success: true, message: 'Removed from cart' });
   } catch (err) {
      return next(err);
   }
};

export const clearMyCart = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      await prisma.cartItems.deleteMany({ where: { userId: user.id } });
      return res.status(200).json({ success: true, message: 'Cart cleared' });
   } catch (err) {
      return next(err);
   }
};

export const getCartCount = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const count = await prisma.cartItems.count({ where: { userId: user.id } });
      return res.status(200).json({ success: true, count });
   } catch (err) {
      return next(err);
   }
};

export const getWishlistCount = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user;
      if (!user?.id || !isValidObjectId(user.id)) {
         return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const count = await prisma.wishlist.count({ where: { userId: user.id } });
      return res.status(200).json({ success: true, count });
   } catch (err) {
      return next(err);
   }
};

export const getSuggestedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, subcategory } = req.query as {
      category?: string;
      subcategory?: string;
    };

    if (!category && !subcategory) {
      return res.status(400).json({
        success: false,
        message:
          'At least category or subcategory is required',
      });
    }

    const where: any = {
      stock: {
        gt: 0,
      },
    };

    if (subcategory) {
      where.subcategory = subcategory;
    } else if (category) {
      where.category = category;
    }

    const products = await prisma.products.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        discountedPrice: true,
        category: true,
        subcategory: true,
        stock: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getSearchSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, limit } = req.query as {
      search?: string;
      limit?: string;
    };

    const trimmed = search?.trim();

    if (!trimmed) {
      return res.status(400).json({
        success: false,
        message: 'Search is required',
      });
    }

    const take = limit ? Math.min(Number(limit), 20) : 5;

    const products = await prisma.products.findMany({
      where: {
        OR: [
          { name: { contains: trimmed, mode: 'insensitive' } },
          { description: { contains: trimmed, mode: 'insensitive' } },
          { category: { contains: trimmed, mode: 'insensitive' } },
          { tags: { has: trimmed } },          // if you have a tags[] field
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        price: true,
        discountedPrice: true,
        stock: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};