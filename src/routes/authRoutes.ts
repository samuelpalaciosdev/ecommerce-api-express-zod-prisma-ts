import express from 'express';
import { login, register, generateNewRefreshToken, logout } from '../controllers/authControllers';
const router = express.Router();
import authenticateUser from '../middleware/authentication';
import rateLimit from '../middleware/rateLimiter';

router.post('/register', rateLimit, register);
router.post('/login', rateLimit, login);
router.post('/refresh', authenticateUser, generateNewRefreshToken);
router.delete('/logout', authenticateUser, logout);

export default router;
