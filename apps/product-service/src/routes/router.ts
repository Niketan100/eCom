import { Router } from 'express'
import { createProduct, getall, getInventoryProducts, getOrders, getsingle } from '../controllers/product.controller'
import isAuthenticated from './../../../../packages/middleware/isAuthanticated';


const router = Router()

router.post('/create-product', isAuthenticated ,createProduct);
router.get('/get-products', isAuthenticated, getInventoryProducts);
router.get('/get-orders', isAuthenticated, getOrders);
router.get('/get-all', getall);
router.get('/:slug',getsingle);

export default router