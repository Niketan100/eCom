
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.ImagesScalarFieldEnum = {
  id: 'id',
  file_id: 'file_id',
  url: 'url',
  userId: 'userId',
  shopId: 'shopId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UsersScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  following: 'following',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShopReviewsScalarFieldEnum = {
  id: 'id',
  shopId: 'shopId',
  userId: 'userId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShopsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  openingHours: 'openingHours',
  coverImage: 'coverImage',
  website: 'website',
  socialMediaLinks: 'socialMediaLinks',
  rating: 'rating',
  sellerId: 'sellerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SellerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phoneNumber: 'phoneNumber',
  country: 'country',
  address: 'address',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  password: 'password',
  stripeAccountId: 'stripeAccountId',
  businessName: 'businessName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  shopId: 'shopId'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  toSellerId: 'toSellerId',
  fromUserId: 'fromUserId',
  fromSellerId: 'fromSellerId',
  sellerId: 'sellerId',
  type: 'type',
  title: 'title',
  message: 'message',
  data: 'data',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.ProductsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  shortDescription: 'shortDescription',
  description: 'description',
  features: 'features',
  highlights: 'highlights',
  category: 'category',
  subcategory: 'subcategory',
  brand: 'brand',
  price: 'price',
  discountedPrice: 'discountedPrice',
  stock: 'stock',
  sku: 'sku',
  tags: 'tags',
  shippingWeight: 'shippingWeight',
  warranty: 'warranty',
  isActive: 'isActive',
  isFeatured: 'isFeatured',
  views: 'views',
  salesCount: 'salesCount',
  averageRating: 'averageRating',
  reviewCount: 'reviewCount',
  sellerId: 'sellerId',
  shopId: 'shopId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductVariantsScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  value: 'value',
  stock: 'stock',
  additionalPrice: 'additionalPrice',
  createdAt: 'createdAt'
};

exports.Prisma.ProductImagesScalarFieldEnum = {
  id: 'id',
  file_id: 'file_id',
  url: 'url',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.ProductReviewsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.CartItemsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrdersScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sellerId: 'sellerId',
  productId: 'productId',
  quantity: 'quantity',
  totalPrice: 'totalPrice',
  shippingAddress: 'shippingAddress',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentsScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  amount: 'amount',
  stripePaymentIntentId: 'stripePaymentIntentId',
  paymentMethod: 'paymentMethod',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ComplaintsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sellerId: 'sellerId',
  orderId: 'orderId',
  subject: 'subject',
  message: 'message',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventsScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  startDate: 'startDate',
  endDate: 'endDate',
  banner: 'banner',
  sellerId: 'sellerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponsScalarFieldEnum = {
  id: 'id',
  code: 'code',
  discountPercentage: 'discountPercentage',
  expiresAt: 'expiresAt',
  maxUses: 'maxUses',
  usedCount: 'usedCount',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.Site_configScalarFieldEnum = {
  id: 'id',
  categories: 'categories',
  subcategories: 'subcategories'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};
exports.NotificationType = exports.$Enums.NotificationType = {
  ORDER_CREATED: 'ORDER_CREATED',
  PRODUCT_VIEWED: 'PRODUCT_VIEWED'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.ComplaintStatus = exports.$Enums.ComplaintStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

exports.Prisma.ModelName = {
  Images: 'Images',
  users: 'users',
  shopReviews: 'shopReviews',
  shops: 'shops',
  seller: 'seller',
  Notification: 'Notification',
  products: 'products',
  productVariants: 'productVariants',
  productImages: 'productImages',
  productReviews: 'productReviews',
  wishlist: 'wishlist',
  cartItems: 'cartItems',
  orders: 'orders',
  payments: 'payments',
  complaints: 'complaints',
  events: 'events',
  coupons: 'coupons',
  site_config: 'site_config'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
