import express from 'express';
const router = express.Router();
import { createBrand } from '../controllers/brandController';

router.route('/').post(createBrand);

export default router;
