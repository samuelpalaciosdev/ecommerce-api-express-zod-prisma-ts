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
exports.logout = exports.generateNewRefreshToken = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const prisma_1 = __importDefault(require("../services/prisma"));
const utils_1 = require("../utils");
const hashPassword_1 = require("../middleware/hashPassword");
const auth_1 = require("../types/auth");
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = require("../utils/jwt");
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
    // * Check if user has a refresh token, if so, use it
    if (existingToken) {
        const { isValid, updatedAt } = existingToken;
        if (!isValid) {
            throw new errors_1.UnauthenticatedError('Invalid credentials');
        }
        const expiresAt = updatedAt.getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
        // * Check if refresh token is NOT expired (if its not, use it)
        if (expiresAt > Date.now()) {
            refreshToken = existingToken.refreshToken;
            const token = (0, utils_1.attachCookieToResponse)(res, tokenUser, refreshToken);
            // console.log('Token NOT EXPIRED');
            // console.log('Current refresh token expires at:', new Date(expiresAt).toLocaleString());
            res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user: tokenUser });
            return;
        }
        else {
            // ! Existing token has expired
            // console.log('Token EXPIRED');
            refreshToken = crypto_1.default.randomBytes(40).toString('hex');
            const userAgent = req.headers['user-agent'] || '';
            const ip = req.ip;
            // * Update refresh token on the db
            const updatedRefreshToken = yield prisma_1.default.token.update({
                where: {
                    id: existingToken.id,
                },
                data: {
                    refreshToken: refreshToken,
                    isValid: true,
                    updatedAt: new Date(),
                    ip: req.ip,
                    userAgent: req.headers['user-agent'] || '',
                },
            });
            const expiresAt = updatedRefreshToken.updatedAt.getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
            // console.log('New refresh token expires at:', new Date(expiresAt).toLocaleString());
            const token = (0, utils_1.attachCookieToResponse)(res, tokenUser, refreshToken);
            return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user: tokenUser });
        }
    }
    // * No existing token for the user, generate a new one
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
    // console.log('Generated new refresh token');
    return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user: tokenUser });
});
exports.login = login;
const generateNewRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.signedCookies;
    // * Des-encrypt refresh token
    const decodedRefreshToken = (0, jwt_1.isTokenValid)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const refreshTokenValue = decodedRefreshToken.refreshToken;
    // ! Check if refresh token exists
    if (!refreshToken) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    const user = req.user;
    if (!user) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    // * Find existing user refresh token
    const existingToken = yield prisma_1.default.token.findFirst({
        where: {
            user: {
                id: user.id,
            },
            refreshToken: refreshTokenValue,
        },
    });
    // console.log(existingToken);
    // console.log(`Is valid: ${existingToken?.isValid}`);
    // ! Check if refresh token exists or it's valid
    if (!existingToken || !existingToken.isValid) {
        throw new errors_1.UnauthenticatedError('Authentication invalid brooooo');
    }
    // * Create new refresh token
    const newRefreshToken = crypto_1.default.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip;
    // * Update refresh token on the db
    const updateRefreshToken = yield prisma_1.default.token.update({
        where: {
            refreshToken: refreshTokenValue,
        },
        data: {
            refreshToken: newRefreshToken,
            ip: ip,
            userAgent: userAgent,
        },
    });
    const newUser = Object.assign(Object.assign({}, user), { password: '', refreshToken: newRefreshToken });
    const tokenUser = (0, utils_1.createTokenUser)(newUser);
    // console.log('newRefreshToken:', newRefreshToken);
    // console.log('updateRefreshToken:', updateRefreshToken);
    const token = (0, jwt_1.attachNewRefreshTokenToResponse)(res, tokenUser, newRefreshToken);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', msg: 'Refresh token updated!', user: tokenUser });
});
exports.generateNewRefreshToken = generateNewRefreshToken;
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
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        signed: true,
        maxAge: 0,
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        signed: true,
        maxAge: 0,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'User logged out!' });
});
exports.logout = logout;
