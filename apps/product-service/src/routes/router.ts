import { Router } from 'express'
import { createProduct, getall, getCategories, getInventoryProducts, getOrders, getSellerPayments, getsingle, getsingleBySlug, placeOrder, updateProduct , deleteProduct, getUserOrders, getMyCart, addToCart, updateCartItemQuantity, removeFromCart, clearMyCart, getMyWishlist, addToWishlist, removeFromWishlist, getCartCount, getWishlistCount, getOrderByIdForSeller, updateOrderStatusForSeller } from '../controllers/product.controller'
import isSellerAuthenticated from './../../../../packages/middleware/isSellerAuthenticated';
import isUserAuthenticated from './../../../../packages/middleware/isUserAuthenticated';


const router = Router()

// Seller-only routes
router.post('/create-product', isSellerAuthenticated ,createProduct);
router.get('/get-products', isSellerAuthenticated, getInventoryProducts);
router.get('/get-orders', isSellerAuthenticated, getOrders);
router.get('/orders/:id', isSellerAuthenticated, getOrderByIdForSeller);
router.patch('/orders/:id/status', isSellerAuthenticated, updateOrderStatusForSeller);
router.get('/payments/my', isSellerAuthenticated, getSellerPayments);
router.get('/get-all', getall);
router.get('/slug/:slug', getsingleBySlug);
router.get('/categories', getCategories)

// User-only routes
router.get('/user-orders', isUserAuthenticated, getUserOrders);

// CART (user)
router.get('/cart', isUserAuthenticated, getMyCart);
router.get('/cart/count', isUserAuthenticated, getCartCount);
router.post('/cart/add', isUserAuthenticated, addToCart);
router.patch('/cart/:productId', isUserAuthenticated, updateCartItemQuantity);
router.delete('/cart/:productId', isUserAuthenticated, removeFromCart);
router.delete('/cart', isUserAuthenticated, clearMyCart);

// WISHLIST (user)
router.get('/wishlist', isUserAuthenticated, getMyWishlist);
router.get('/wishlist/count', isUserAuthenticated, getWishlistCount);
router.post('/wishlist/add', isUserAuthenticated, addToWishlist);
router.delete('/wishlist/:productId', isUserAuthenticated, removeFromWishlist);
router.get('/:id',getsingle);

// Seller-only product management
router.post('/update/:id', isSellerAuthenticated, updateProduct);

// User-only checkout
router.post('/orders/place', isUserAuthenticated, placeOrder);

// Seller-only delete
router.delete('/delete/:id', isSellerAuthenticated, deleteProduct);   

export default router