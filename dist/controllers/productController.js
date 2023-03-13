"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProduct = exports.getAllProducts = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const prisma_1 = __importDefault(require("../services/prisma"));
const product_1 = require("../types/product");
const path_1 = __importDefault(require("path"));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.findMany();
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, count: products.length });
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // ! Check if product exists
    if (!id) {
        throw new errors_1.NotFoundError(`No product with id: ${id}`);
    }
    const product = yield prisma_1.default.product.findUnique({
        where: { id: Number(id) },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, image, color, inventory, featured, brandId, categoryId } = req.body;
    // ! Check if all fields are filled
    // * Not checking color because it's optional and featured because is default to false
    if (!name || !description || !price || !image || !inventory || !brandId || !categoryId) {
        throw new Error('Please provide all required fields');
    }
    // * Instock based on inventory
    const inStock = inventory >= 1 ? true : false;
    // * Validate data with zod
    const validatedData = product_1.productSchema.parse(req.body);
    //* Create product
    const product = yield prisma_1.default.product.create({
        data: {
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            image: validatedData.image,
            color: validatedData.color,
            inventory: validatedData.inventory,
            averageRating: 4,
            featured: validatedData.featured,
            inStock: inStock,
            brand: { connect: { id: validatedData.brandId } },
            category: { connect: { id: validatedData.categoryId } },
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: 'success', product });
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // ! Check if product exists
    if (!id) {
        throw new errors_1.NotFoundError(`No product with id: ${id}`);
    }
    // * Validate data with zod
    const { name, description, price, image, color, inventory, featured, brandId, categoryId } = product_1.productSchema.parse(req.body);
    // * Instock based on inventory
    const inStock = inventory >= 1 ? true : false;
    //* Update product
    const product = yield prisma_1.default.product.update({
        where: { id: Number(id) },
        data: {
            name,
            description,
            price,
            image,
            color,
            inventory,
            featured,
            inStock,
            brandId,
            categoryId,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', product });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // ! Check if product exists
    if (!id) {
        throw new errors_1.NotFoundError(`No product with id: ${id}`);
    }
    const product = yield prisma_1.default.product.delete({
        where: { id: Number(id) },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', msg: 'Product deleted!' });
});
exports.deleteProduct = deleteProduct;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ! Check if image is uploaded
    if (!req.files) {
        throw new errors_1.BadRequestError('No file uploaded');
    }
    const productImg = req.files.image;
    // ! Check if file is an image
    if (!productImg.mimetype.startsWith('image')) {
        throw new errors_1.BadRequestError('Please upload an image file');
    }
    // ! Check file size
    const maxSize = 1024 * 1024 * 2;
    if (productImg.size > maxSize) {
        throw new errors_1.BadRequestError('Please upload an image less than 2MB');
    }
    const imagePath = path_1.default.join(__dirname, '../public/images/' + `${productImg.name}`);
    yield productImg.mv(imagePath);
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', image: `/images/${productImg.name}` });
});
exports.uploadImage = uploadImage;
