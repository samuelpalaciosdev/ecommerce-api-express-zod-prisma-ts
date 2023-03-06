"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandSchema = void 0;
const zod_1 = require("zod");
const product_1 = require("./product");
const brandSchema = zod_1.z.object({
    name: zod_1.z.string().max(50, { message: 'Name must be less than 50 characters' }),
    description: zod_1.z.string().max(500, { message: 'Description must be less than 500 characters' }),
    logo: zod_1.z.string(),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().optional(),
    products: product_1.productSchema.array().optional(),
});
exports.brandSchema = brandSchema;
