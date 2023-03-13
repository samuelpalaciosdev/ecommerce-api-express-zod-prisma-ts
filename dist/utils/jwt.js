"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachNewRefreshTokenToResponse = exports.attachCookieToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = (payload, secretKey, refreshToken) => {
    const token = jsonwebtoken_1.default.sign(payload, secretKey);
    return token;
};
exports.createJWT = createJWT;
const isTokenValid = (token, secretKey) => jsonwebtoken_1.default.verify(token, secretKey);
exports.isTokenValid = isTokenValid;
const attachCookieToResponse = (res, user, refreshToken) => {
    // * Create token
    const accessTokenJWT = (0, exports.createJWT)(user, process.env.ACCESS_TOKEN_SECRET);
    const refreshTokenJWT = (0, exports.createJWT)(user, process.env.REFRESH_TOKEN_SECRET, refreshToken);
    // * Sending tokens as cookies
    //* Access token
    const twentyMins = 1000 * 60 * 20; // 20mins in ms
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        sameSite: 'none',
        maxAge: twentyMins, // accesToken expires in 20mins
    });
    //* Refresh token
    const oneHour = 1000 * 60 * 60; // 1 hour in ms
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        sameSite: 'none',
        maxAge: oneHour, // refreshToken expires in 1 hour
    });
};
exports.attachCookieToResponse = attachCookieToResponse;
const attachNewRefreshTokenToResponse = (res, user, refreshToken) => {
    // * Create token
    const refreshTokenJWT = (0, exports.createJWT)(user, process.env.REFRESH_TOKEN_SECRET, refreshToken);
    // * Sending new refreshToken as cookie
    const oneHour = 1000 * 60 * 60; // 1 hour in ms
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        sameSite: 'none',
        maxAge: oneHour, // refreshToken expires in 1 hour
    });
};
exports.attachNewRefreshTokenToResponse = attachNewRefreshTokenToResponse;
