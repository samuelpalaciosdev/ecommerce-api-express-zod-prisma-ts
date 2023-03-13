"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
const review_1 = require("./review");
const productSchema = zod_1.z.object({
    name: zod_1.z.string().max(100, { message: 'Name must be less than 100 characters' }),
    description: zod_1.z.string().max(500, { message: 'Description must be less than 500 characters' }),
    price: zod_1.z
        .number()
        .nonnegative()
        .min(0, { message: 'Please provide a valid price for the product' }),
    image: zod_1.z.string().min(4, { message: 'Please provide a valid image URL' }),
    color: zod_1.z.array(zod_1.z.string()).min(1, { message: 'Please provide at least one color' }),
    inventory: zod_1.z
        .number()
        .nonnegative({ message: 'Please provide a value greater than or equal to 0' })
        .default(0),
    averageRating: zod_1.z.number().optional(),
    featured: zod_1.z.boolean().default(false),
    inStock: zod_1.z.boolean().default(true),
    brandId: zod_1.z.string().cuid('Please provide a valid brand id'),
    categoryId: zod_1.z.string().cuid('Please provide a valid category id'),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().optional(),
    review: review_1.reviewSchema.array().optional(),
});
exports.productSchema = productSchema;
