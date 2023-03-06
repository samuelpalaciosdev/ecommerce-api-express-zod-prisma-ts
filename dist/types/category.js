"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
const product_1 = require("./product");
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().max(25, { message: 'Name must be less than 25 characters' }),
    description: zod_1.z.string().max(500, { message: 'Description must be less than 500 characters' }),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().optional(),
    products: product_1.productSchema.array().optional(),
});
exports.categorySchema = categorySchema;
