"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(35, { message: 'Name must be less than 35 characters' }),
    lastName: zod_1.z.string().min(1).max(35, { message: 'Last name must be less than 35 characters' }),
    email: zod_1.z.string().email({ message: 'Please provide email' }),
    password: zod_1.z.string().min(8, { message: 'Please provide a valid password with minimum 8 characters' }),
    role: zod_1.z.enum(['client', 'admin', 'superAdmin']).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Please provide email' }),
    password: zod_1.z.string().min(8, { message: 'Please provide valid password' }),
});
