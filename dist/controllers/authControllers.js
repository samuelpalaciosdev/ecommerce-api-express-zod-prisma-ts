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
const crypto_1 = __importDefault(require("crypto"));
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
    // const token = attachCookieToResponse(res, tokenUser); // ! Single cookie
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
    // * Refresh token
    let refreshToken = '';
    // ! Check if refresh token already exists
    const existingToken = yield prisma_1.default.token.findFirst({
        where: {
            user: {
                id: user.id,
            },
        },
    });
    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new errors_1.UnauthenticatedError('Invalid credentials');
        }
        refreshToken = existingToken.refreshToken;
        const token = (0, utils_1.attachCookieToResponse)(res, tokenUser, refreshToken);
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user: tokenUser });
        return;
    }
    refreshToken = crypto_1.default.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip;
    // * Save refresh token to db
    yield prisma_1.default.token.create({
        data: {
            refreshToken: refreshToken,
            ip: ip,
            userAgent: userAgent,
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });
    const token = (0, utils_1.attachCookieToResponse)(res, tokenUser, refreshToken);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user: tokenUser });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // * Delete refresh token from db
    yield prisma_1.default.token.deleteMany({
        where: {
            user: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        },
    });
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'User logged out!' });
});
exports.logout = logout;
