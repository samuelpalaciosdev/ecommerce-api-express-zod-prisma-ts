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
exports.authorizePermissions = void 0;
const errors_1 = require("../errors");
const prisma_1 = __importDefault(require("../services/prisma"));
const utils_1 = require("../utils");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken } = req.signedCookies;
    try {
        if (accessToken) {
            const payload = (0, utils_1.isTokenValid)(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = payload.user;
            req.user = user;
            return next();
        }
        const payload = (0, utils_1.isTokenValid)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingToken = yield prisma_1.default.token.findFirst({
            where: {
                user: {
                    id: payload.user.id,
                },
                refreshToken: payload.user.refreshToken,
            },
        });
        if (!existingToken || !(existingToken === null || existingToken === void 0 ? void 0 : existingToken.isValid)) {
            throw new errors_1.UnauthenticatedError('Authentication Invalid');
        }
        (0, utils_1.attachCookieToResponse)(res, payload.user, existingToken.refreshToken);
        req.user = payload.user;
        console.log('Hola from the auth middleware: success!');
        next();
    }
    catch (error) {
        console.log('Hola from the auth middleware: error!');
        throw new errors_1.UnauthenticatedError('Authentication invalid');
    }
});
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : '')) {
            throw new errors_1.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
exports.default = authenticateUser;
