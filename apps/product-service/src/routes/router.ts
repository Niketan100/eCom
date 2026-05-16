import { Router } from 'express'
import { createProduct } from '../controllers/product.controller'
import isAuthenticated from './../../../../packages/middleware/isAuthanticated';


const router = Router()

router.post('/create-product', isAuthenticated ,createProduct);

export default router