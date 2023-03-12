import express from 'express';
import { login, register, logout } from '../controllers/authControllers';
const router = express.Router();
import authenticateUser from '../middleware/authentication';

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);

export default router;
