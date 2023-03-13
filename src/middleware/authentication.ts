import { NextFunction, Response } from 'express';
import { Jwt, JwtPayload } from 'jsonwebtoken';
import { UnauthenticatedError, UnauthorizedError } from '../errors';
import prisma from '../services/prisma';
import { AuthenticatedUser } from '../types/payload';
import { AuthenticatedRequest } from '../types/request';
import { attachCookieToResponse, isTokenValid } from '../utils';

const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
      const user = payload.user as AuthenticatedUser;
      req.user = user;
      return next();
    }

    const payload = isTokenValid(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
    const existingToken = await prisma.token.findFirst({
      where: {
        user: {
          id: payload.user.id,
        },
        refreshToken: payload.user.refreshToken,
      },
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError('Authentication Invalid');
    }

    attachCookieToResponse(res, payload.user, existingToken.refreshToken);
    req.user = payload.user;
    console.log('Hola from the auth middleware: success!');
    next();
  } catch (error) {
    console.log('Hola from the auth middleware: error!');
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export const authorizePermissions = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role ?? '')) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

export default authenticateUser;
