import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { refreshToken } from '../types/refreshToken';
import { tokenUser } from '../types/user';

export const createJWT = (payload: tokenUser, refreshToken?: string) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

export const isTokenValid = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string);

export const attachCookieToResponse = (res: Response, user: tokenUser, refreshToken: string) => {
  // * Create token
  const accessTokenJWT = createJWT(user);
  const refreshTokenJWT = createJWT(user, refreshToken);

  // * Sending tokens as cookies

  //* Access token
  const twentyMins = 1000 * 60 * 20; // 20mins in ms
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    expires: new Date(Date.now() + twentyMins), // accesToken expires in 20mins
  });
  //* Refresh token
  const threeDays = 1000 * 60 * 60 * 24 * 3; // 3 days in ms
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    expires: new Date(Date.now() + threeDays), // refreshToken expires in 3 days
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
