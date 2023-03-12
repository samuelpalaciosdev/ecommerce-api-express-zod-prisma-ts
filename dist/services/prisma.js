"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hashPassword_1 = require("../middleware/hashPassword");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma.$use(hashPassword_1.hashPasswordMiddleware);
exports.default = prisma;
