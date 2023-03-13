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
    sameSite: 'none',
    maxAge: twentyMins, // accesToken expires in 20mins
  });
  //* Refresh token
  const oneHour = 1000 * 60 * 60; // 1 hour in ms
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    sameSite: 'none',
    maxAge: oneHour, // refreshToken expires in 1 hour
  });
};

export const attachNewRefreshTokenToResponse = (
  res: Response,
  user: tokenUser,
  refreshToken?: string
) => {
  // * Create token
  const refreshTokenJWT = createJWT(user, process.env.REFRESH_TOKEN_SECRET as string, refreshToken);

  // * Sending new refreshToken as cookie
  const oneHour = 1000 * 60 * 60; // 1 hour in ms
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    sameSite: 'none',
    maxAge: oneHour, // refreshToken expires in 1 hour
  });
};
