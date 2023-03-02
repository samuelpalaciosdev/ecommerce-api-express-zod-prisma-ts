import express from 'express';
import authenticateUser, { authorizePermissions } from '../middleware/authentication';
import { getAllUsers, showCurrentUser, updateUser } from '../controllers/userControllers';
const router = express.Router();

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/update').patch(authenticateUser, updateUser);

export default router;
