"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
const reviewSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string().max(50),
    description: zod_1.z
        .string()
        .max(250, { message: 'Description must be less than 250 characters' })
        .optional(),
    rating: zod_1.z.number().min(1).max(5),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().nullable(),
    userId: zod_1.z.string(),
    productId: zod_1.z.number(),
});
exports.reviewSchema = reviewSchema;
