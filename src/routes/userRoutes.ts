import express from 'express';
import authenticateUser, { authorizePermissions } from '../middleware/authentication';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  showCurrentUser,
  updateUserPassword,
} from '../controllers/userControllers';
const router = express.Router();

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/update').patch(authenticateUser, updateUser);
router.route('/updatePassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

export default router;
