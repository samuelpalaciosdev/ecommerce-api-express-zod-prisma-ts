import express from 'express';
const router = express.Router();
import { getAllProducts, getSingleProduct, createProduct } from '../controllers/productController';

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getSingleProduct);

export default router;
