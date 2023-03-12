import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { refreshToken } from '../types/refreshToken';
import { tokenUser } from '../types/user';

export const createJWT = (payload: tokenUser, secretKey: string, refreshToken?: string) => {
  const token = jwt.sign(payload, secretKey);
  return token;
};

export const isTokenValid = (token: string, secretKey: string) => jwt.verify(token, secretKey);

export const attachCookieToResponse = (res: Response, user: tokenUser, refreshToken?: string) => {
  // * Create token
  const accessTokenJWT = createJWT(user, process.env.ACCESS_TOKEN_SECRET as string);
  const refreshTokenJWT = createJWT(user, process.env.REFRESH_TOKEN_SECRET as string, refreshToken);

  // * Sending tokens as cookies

  //* Access token
  const twentyMins = 1000 * 60 * 20; // 20mins in ms
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    maxAge: twentyMins, // accesToken expires in 20mins
  });
  //* Refresh token
  const threeDays = 1000 * 60 * 60 * 24 * 3; // 3 days in ms
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    maxAge: threeDays, // refreshToken expires in 3 days
  });
};

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
