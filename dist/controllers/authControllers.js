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
exports.logout = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const prisma_1 = __importDefault(require("../services/prisma"));
const utils_1 = require("../utils");
const hashPassword_1 = require("../middleware/hashPassword");
const auth_1 = require("../types/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, email, password } = req.body;
    // ! Check if all fields are filled
    if (!name || !lastName || !email || !password) {
        throw new errors_1.BadRequestError('Please provide all fields');
    }
    // ! Check if email already exists
    const emailAlreadyExists = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (emailAlreadyExists) {
        throw new errors_1.BadRequestError('Email already exists');
    }
    // * Set first registered user as admin
    const isFirstAccount = (yield prisma_1.default.user.count()) === 0;
    const role = isFirstAccount ? 'admin' : 'client';
    // * Create user (if req.body is valid)
    const validatedData = auth_1.registerSchema.parse(req.body);
    const user = yield prisma_1.default.user.create({
        data: {
            name: validatedData.name,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: validatedData.password,
            role: role,
        },
    });
    // * JWT
    const tokenUser = (0, utils_1.createTokenUser)(user);
    const token = (0, utils_1.attachCookieToResponse)(res, tokenUser);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: 'success', user: tokenUser });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // ! Check if all fields are filled
    if (!email || !password) {
        throw new errors_1.BadRequestError('Provide all fields, try again');
    }
    // * Validate with zod
    const validatedData = auth_1.loginSchema.parse(req.body);
    // ! Check if user exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    // ! Check if password is correct
    const isPasswordCorrect = yield (0, hashPassword_1.checkPassword)(password, user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    const tokenUser = (0, utils_1.createTokenUser)(user);
    const token = (0, utils_1.attachCookieToResponse)(res, tokenUser);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: 'success', user: tokenUser });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'User logged out!' });
});
exports.logout = logout;
