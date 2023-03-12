"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookieToResponse = exports.isTokenValid = exports.createJWT = void 0;
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
        expires: new Date(Date.now() + twentyMins), // accesToken expires in 20mins
    });
    //* Refresh token
    const threeDays = 1000 * 60 * 60 * 24 * 3; // 3 days in ms
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + threeDays), // refreshToken expires in 3 days
    });
};
exports.attachCookieToResponse = attachCookieToResponse;
// export const attachSingleCookieToResponse = (res: Response, user: tokenUser) => {
//   // * Create token
//   const token = createJWT(user);
//   // * Sending token as cookie
//   const thirtyMins = 1000 * 60 * 30; // 30mins in ms
//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + thirtyMins), // Token expires in 30mins
//     secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
//     signed: true,
//   });
// };
