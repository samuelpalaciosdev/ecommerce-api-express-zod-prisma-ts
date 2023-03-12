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
const prisma_1 = __importDefault(require("../services/prisma"));
const errors_1 = require("../errors");
const brand_1 = require("../types/brand");
const http_status_codes_1 = require("http-status-codes");
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, logo } = req.body;
    // ! Check if all fields are filled
    if (!name || !description || !logo) {
        throw new errors_1.BadRequestError('Please provide  all fields');
    }
    // * Validate with zod
    const validatedData = brand_1.brandSchema.parse(req.body);
    // * Create category
    const brand = yield prisma_1.default.brand.create({
        data: {
            name: validatedData.name,
            description: validatedData.description,
            logo: validatedData.logo,
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: 'success', brand });
});
exports.default = createBrand;
