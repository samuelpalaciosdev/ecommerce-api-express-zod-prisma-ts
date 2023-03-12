"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPasswordSchema = exports.updateUserSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1).max(35, { message: 'Name must be less than 35 characters' }),
    lastName: zod_1.z.string().min(1).max(35, { message: 'Last name must be less than 35 characters' }),
    email: zod_1.z.string().email({ message: 'Please provide email' }),
    password: zod_1.z
        .string()
        .min(8, { message: 'Please provide a valid password with minimum 8 characters' }),
    isActive: zod_1.z.boolean().default(true),
    role: zod_1.z.enum(['client', 'admin', 'superAdmin']),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(35, { message: 'Name must be less than 35 characters' }),
    lastName: zod_1.z.string().min(1).max(35, { message: 'Last name must be less than 35 characters' }),
    email: zod_1.z.string().email({ message: 'Please provide email' }),
});
exports.updateUserPasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z
        .string()
        .min(8, { message: 'Please try again, your current password is at least 8 characters long' }),
    newPassword: zod_1.z
        .string()
        .min(8, { message: 'Please provide a valid password with minimum 8 characters' }),
});
