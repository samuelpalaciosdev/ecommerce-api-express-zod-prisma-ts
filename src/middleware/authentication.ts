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
      const { iat, ...user } = isTokenValid(accessToken) as AuthenticatedUser;
      req.user = user;
      return next();
    }
    const { iat, ...user } = isTokenValid(refreshToken) as AuthenticatedUser;

    const existingToken = await prisma.token.findFirst({
      where: {
        user: {
          id: user.id,
        },
        refreshToken: user.refreshToken,
      },
    });

    if (!existingToken || !existingToken.isValid) {
      throw new UnauthenticatedError('Authentication invalid');
    }

    attachCookieToResponse(res, user, existingToken.refreshToken);

    req.user = user;
    return next();
  } catch (error) {
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
