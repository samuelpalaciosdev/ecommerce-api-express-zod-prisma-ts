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
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const hashPassword_1 = require("../middleware/hashPassword");
const prisma_1 = __importDefault(require("../services/prisma"));
const user_1 = require("../types/user");
const utils_1 = require("../utils");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // * Get all users with role client
    const users = yield prisma_1.default.user.findMany({
        where: { role: 'client' },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            isActive: true,
            role: true,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // * Find user by id
    const { id } = req.params;
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            isActive: true,
            role: true,
        },
    });
    if (!user) {
        throw new errors_1.NotFoundError(`No user with id: ${id}`);
    }
    // !Check for request user (the current logged in user that is making the request)
    const currentUser = req.user;
    if (!currentUser) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    const requestUser = {
        id: currentUser.id,
        name: currentUser.name,
        lastName: currentUser.lastName,
        email: currentUser.email,
        isActive: currentUser.isActive,
        role: currentUser.role,
        refreshToken: (_a = currentUser.refreshToken) !== null && _a !== void 0 ? _a : null,
    };
    (0, utils_1.checkPermissions)(requestUser, user.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user });
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, email } = req.body;
    // ! Check if all fields are provided
    if (!name || !lastName || !email) {
        throw new errors_1.BadRequestError('Please provide all fields');
    }
    // * Validate data with zod
    const validatedData = user_1.updateUserSchema.parse(req.body);
    // !Check if user exists
    const user = req.user;
    if (!user) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            name: validatedData.name,
            lastName: validatedData.lastName,
            email: validatedData.email,
        },
    });
    const tokenUser = (0, utils_1.createTokenUser)(updatedUser);
    const token = (0, utils_1.attachCookieToResponse)(res, tokenUser);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', user: tokenUser });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { oldPassword, newPassword } = req.body;
    // ! Check if all fields are provided
    if (!oldPassword || !newPassword) {
        throw new errors_1.BadRequestError('Please provide all fields');
    }
    // ! Check if user exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
        },
    });
    if (!user) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    // ! Check if password is correct
    const isPasswordCorrect = yield (0, hashPassword_1.checkPassword)(oldPassword, user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.UnauthenticatedError('Invalid credentials');
    }
    // * Validate data with zod
    const validatedData = user_1.updateUserPasswordSchema.parse(req.body);
    // * Update password
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: newPassword,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', msg: 'Password updated!' });
});
exports.updateUserPassword = updateUserPassword;
