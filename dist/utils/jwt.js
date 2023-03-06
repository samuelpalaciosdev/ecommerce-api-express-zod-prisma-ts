"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookieToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
};
exports.createJWT = createJWT;
const isTokenValid = (token) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
exports.isTokenValid = isTokenValid;
const attachCookieToResponse = (res, user) => {
    // * Create token
    const token = (0, exports.createJWT)(user);
    // * Sending token as cookie
    const thirtyMins = 1000 * 60 * 30; // 30mins in ms
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + thirtyMins),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
};
exports.attachCookieToResponse = attachCookieToResponse;
