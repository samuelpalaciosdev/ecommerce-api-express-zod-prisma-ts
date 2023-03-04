import express from 'express';
const router = express.Router();
import { createCategory } from '../controllers/categoryController';

router.route('/').post(createCategory);

export default router;
