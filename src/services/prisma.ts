import { hashPasswordMiddleware } from '../middleware/hashPassword';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

prisma.$use(hashPasswordMiddleware);
export default prisma;
