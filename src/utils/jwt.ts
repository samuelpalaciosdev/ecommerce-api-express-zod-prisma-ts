import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { refreshToken } from '../types/refreshToken';
import { tokenUser } from '../types/user';

interface JWTData {
  payload: {
    user: tokenUser;
    refreshToken?: string;
  };
  secretKey: string;
}

export const createJWT = ({ payload, secretKey }: JWTData) => {
  const token = jwt.sign(payload, secretKey);
  return token;
};

export const isTokenValid = (token: string, secretKey: string) => jwt.verify(token, secretKey);

export const attachCookieToResponse = (res: Response, user: tokenUser, refreshToken?: string) => {
  // * Create tokens
  const accessTokenJWT = createJWT({
    payload: { user },
    secretKey: process.env.ACCESS_TOKEN_SECRET as string,
  });
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
    secretKey: process.env.REFRESH_TOKEN_SECRET as string,
  });

  // * Sending tokens as cookies

  //* Access token
  const fiftyMins = 1000 * 60 * 15; // 15mins in ms
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    // sameSite: 'none',
    maxAge: fiftyMins, // accesToken expires in 15mins
  });
  //* Refresh token

  const refreshTokenExpiracy = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string);
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    // sameSite: 'none',
    maxAge: refreshTokenExpiracy,
  });
};

// ! SETTING ALL TOKENS TO SAMESITE NONE FOR TESTING

export const attachNewRefreshTokenToResponse = (res: Response, user: tokenUser, refreshToken?: string) => {
  // * Create token
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
    secretKey: process.env.REFRESH_TOKEN_SECRET as string,
  });

  // * Sending new refreshToken as cookie
  const refreshTokenExpiracy = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string);
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
    // sameSite: 'none',
    maxAge: refreshTokenExpiracy, // refreshToken expires in 1 hour
  });
};
