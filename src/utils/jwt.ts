import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { tokenUser } from '../types/user';

export const createJWT = (payload: tokenUser) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const isTokenValid = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string);

export const attachCookieToResponse = (res: Response, user: tokenUser) => {
  // * Create token
  const token = createJWT(user);
  // * Sending token as cookie
  const thirtyMins = 1000 * 60 * 30; // 30mins in ms
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + thirtyMins), // Token expires in 30mins
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production env
    signed: true,
  });
};
