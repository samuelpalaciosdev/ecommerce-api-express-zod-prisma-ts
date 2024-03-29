import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import prisma from '../services/prisma';
import { attachCookieToResponse, createTokenUser } from '../utils';
import { checkPassword } from '../middleware/hashPassword';
import { loginSchema, registerSchema } from '../types/auth';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../types/request';
import { User } from '../types/user';
import { isTokenValid, attachNewRefreshTokenToResponse } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;

  // ! Check if all fields are filled
  if (!name || !lastName || !email || !password) {
    throw new BadRequestError('Please provide all fields');
  }
  // ! Check if email already exists
  const emailAlreadyExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists');
  }

  // * Set first registered user as admin
  const isFirstAccount = (await prisma.user.count()) === 0;
  const role = isFirstAccount ? 'admin' : 'client';

  // * Create user (if req.body is valid)
  const validatedData = registerSchema.parse(req.body);
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
      role: role,
    },
  });

  // * JWT

  const tokenUser = createTokenUser(user);
  // const token = attachCookieToResponse(res, tokenUser); // ! Single cookie

  return res.status(StatusCodes.CREATED).json({ status: 'success', user: tokenUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // ! Check if all fields are filled
  if (!email || !password) {
    throw new BadRequestError('Provide all fields, try again');
  }

  // * Validate with zod
  const validatedData = loginSchema.parse(req.body);

  // ! Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // ! Check if password is correct
  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const tokenUser = createTokenUser(user);

  // * Refresh token
  let refreshToken = '';

  // ! Check if refresh token already exists
  const existingToken = await prisma.token.findFirst({
    where: {
      user: {
        id: user.id,
      },
    },
  });

  // * Check if user has a refresh token, if so, use it
  if (existingToken) {
    const { isValid, updatedAt } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError('Invalid credentials');
    }
    const expiresAt = updatedAt.getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string);

    // * Check if refresh token is NOT expired (if its not, use it)
    if (expiresAt > Date.now()) {
      refreshToken = existingToken.refreshToken;
      const token = attachCookieToResponse(res, tokenUser, refreshToken);
      // console.log('Token NOT EXPIRED');
      // console.log('Current refresh token expires at:', new Date(expiresAt).toLocaleString());

      res.status(StatusCodes.OK).json({ status: 'success', user: tokenUser });
      return;
    } else {
      // ! Existing token has expired
      // console.log('Token EXPIRED');

      refreshToken = crypto.randomBytes(40).toString('hex');
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip;
      // * Update refresh token on the db
      const updatedRefreshToken = await prisma.token.update({
        where: {
          id: existingToken.id,
        },
        data: {
          refreshToken: refreshToken,
          isValid: true,
          updatedAt: new Date(),
          ip: req.ip,
          userAgent: req.headers['user-agent'] || '',
        },
      });
      const expiresAt =
        updatedRefreshToken.updatedAt.getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string);
      // console.log('New refresh token expires at:', new Date(expiresAt).toLocaleString());

      const token = attachCookieToResponse(res, tokenUser, refreshToken);
      return res.status(StatusCodes.OK).json({ status: 'success', user: tokenUser });
    }
  }

  // * No existing token for the user, generate a new one

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip;

  // * Save refresh token to db
  await prisma.token.create({
    data: {
      refreshToken: refreshToken,
      ip: ip,
      userAgent: userAgent,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const token = attachCookieToResponse(res, tokenUser, refreshToken);
  // console.log('Generated new refresh token');
  return res.status(StatusCodes.OK).json({ status: 'success', user: tokenUser });
};

export const generateNewRefreshToken = async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken } = req.signedCookies;
  // * Des-encrypt refresh token
  const decodedRefreshToken = isTokenValid(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {
    refreshToken: string;
  };

  const refreshTokenValue = decodedRefreshToken.refreshToken;

  // ! Check if refresh token exists
  if (!refreshToken) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const user = req.user;
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // * Find existing user refresh token
  const existingToken = await prisma.token.findFirst({
    where: {
      user: {
        id: user.id,
      },
      refreshToken: refreshTokenValue,
    },
  });
  // console.log(existingToken);
  // console.log(`Is valid: ${existingToken?.isValid}`);

  // ! Check if refresh token exists or it's valid
  if (!existingToken || !existingToken.isValid) {
    throw new UnauthenticatedError('Authentication invalid brooooo');
  }

  // * Create new refresh token
  const newRefreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip;

  // * Update refresh token on the db
  const updateRefreshToken = await prisma.token.update({
    where: {
      refreshToken: refreshTokenValue,
    },
    data: {
      refreshToken: newRefreshToken,
      ip: ip,
      userAgent: userAgent,
    },
  });

  // console.log('newRefreshToken:', newRefreshToken);
  // console.log('updateRefreshToken:', updateRefreshToken);

  const token = attachNewRefreshTokenToResponse(res, user, newRefreshToken);
  return res.status(StatusCodes.OK).json({ status: 'success', msg: 'Refresh token updated!', user });
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  // * Delete refresh token from db
  await prisma.token.deleteMany({
    where: {
      user: {
        id: req.user?.id,
      },
    },
  });

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 0,
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 0,
  });

  res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};
