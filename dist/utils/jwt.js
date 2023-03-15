"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachNewRefreshTokenToResponse = exports.attachCookieToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = ({ payload, secretKey }) => {
    const token = jsonwebtoken_1.default.sign(payload, secretKey);
    return token;
};
exports.createJWT = createJWT;
const isTokenValid = (token, secretKey) => jsonwebtoken_1.default.verify(token, secretKey);
exports.isTokenValid = isTokenValid;
const attachCookieToResponse = (res, user, refreshToken) => {
    // * Create tokens
    const accessTokenJWT = (0, exports.createJWT)({
        payload: { user },
        secretKey: process.env.ACCESS_TOKEN_SECRET,
    });
    const refreshTokenJWT = (0, exports.createJWT)({
        payload: { user, refreshToken },
        secretKey: process.env.REFRESH_TOKEN_SECRET,
    });
    // * Sending tokens as cookies
    //* Access token
    const fiftyMins = 1000 * 60 * 15; // 15mins in ms
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        // sameSite: 'none',
        maxAge: fiftyMins, // accesToken expires in 15mins
    });
    //* Refresh token
    const refreshTokenExpiracy = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        // sameSite: 'none',
        maxAge: refreshTokenExpiracy,
    });
};
exports.attachCookieToResponse = attachCookieToResponse;
// ! SETTING ALL TOKENS TO SAMESITE NONE FOR TESTING
const attachNewRefreshTokenToResponse = (res, user, refreshToken) => {
    // * Create token
    const refreshTokenJWT = (0, exports.createJWT)({
        payload: { user, refreshToken },
        secretKey: process.env.REFRESH_TOKEN_SECRET,
    });
    // * Sending new refreshToken as cookie
    const refreshTokenExpiracy = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        // sameSite: 'none',
        maxAge: refreshTokenExpiracy, // refreshToken expires in 1 hour
    });
};
exports.attachNewRefreshTokenToResponse = attachNewRefreshTokenToResponse;
