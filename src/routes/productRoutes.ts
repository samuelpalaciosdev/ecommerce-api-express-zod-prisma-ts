import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../controllers/productController';
import authenticateUser, { authorizePermissions } from '../middleware/authentication';

router
  .route('/')
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions('admin'), createProduct);

router.route('/uploadImg').post(authenticateUser, authorizePermissions('admin'), uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
  .delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

export default router;
