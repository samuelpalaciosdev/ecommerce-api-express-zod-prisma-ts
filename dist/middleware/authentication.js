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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
            const _a = (0, utils_1.isTokenValid)(accessToken, process.env.ACCESS_TOKEN_SECRET), { iat } = _a, user = __rest(_a, ["iat"]);
            req.user = user;
            return next();
        }
        const _b = (0, utils_1.isTokenValid)(refreshToken, process.env.REFRESH_TOKEN_SECRET), { iat } = _b, user = __rest(_b, ["iat"]);
        const existingToken = yield prisma_1.default.token.findFirst({
            where: {
                user: {
                    id: user.id,
                },
                refreshToken: user.refreshToken,
            },
        });
        if (!existingToken || !existingToken.isValid) {
            throw new errors_1.UnauthenticatedError('Authentication invalid');
        }
        (0, utils_1.attachCookieToResponse)(res, user, existingToken.refreshToken);
        req.user = user;
        return next();
    }
    catch (error) {
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
