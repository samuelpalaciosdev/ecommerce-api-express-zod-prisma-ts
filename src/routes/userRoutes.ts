import express from 'express';
import { getAllUsers, showCurrentUser, updateUser } from '../controllers/userControllers';
const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/me').get(showCurrentUser);
router.route('/update').patch(updateUser);

export default router;
