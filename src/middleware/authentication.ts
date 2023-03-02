import { NextFunction, Response } from 'express';
import { Jwt, JwtPayload } from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';
import { AuthenticatedRequest } from '../types/request';
import { isTokenValid } from '../utils';

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  try {
    const { id, name, lastName, email, isActive, role } = isTokenValid(token) as JwtPayload;

    req.user = {
      id,
      name,
      lastName,
      email,
      isActive,
      role,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default authenticateUser;
