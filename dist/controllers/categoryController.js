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
exports.createCategory = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const prisma_1 = __importDefault(require("../services/prisma"));
const category_1 = require("../types/category");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    // ! Check if all fields are filled
    if (!name || !description) {
        throw new errors_1.BadRequestError('Please provide  all fields');
    }
    // * Validate with zod
    const validatedData = category_1.categorySchema.parse(req.body);
    // * Create category
    const category = yield prisma_1.default.category.create({
        data: {
            name: validatedData.name,
            description: validatedData.description,
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: 'success', category });
});
exports.createCategory = createCategory;
