import { Router } from 'express'
import { createProduct, getall, getInventoryProducts, getOrders, getsingle, getsingleBySlug, updateProduct } from '../controllers/product.controller'
import isAuthenticated from './../../../../packages/middleware/isAuthanticated';


const router = Router()

router.post('/create-product', isAuthenticated ,createProduct);
router.get('/get-products', isAuthenticated, getInventoryProducts);
router.get('/get-orders', isAuthenticated, getOrders);
router.get('/get-all', getall);
router.get('/slug/:slug', getsingleBySlug);
router.get('/:id',getsingle);
router.post('/update/:id', isAuthenticated, updateProduct);

export default router