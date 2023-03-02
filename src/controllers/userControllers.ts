import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { checkPassword } from '../middleware/hashPassword';
import prisma from '../services/prisma';
import { AuthenticatedRequest } from '../types/request';
import { updateUserPasswordSchema, updateUserSchema } from '../types/user';
import { attachCookieToResponse, createTokenUser } from '../utils';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  // * Get all users with role client
  const users = await prisma.user.findMany({ where: { role: 'client' } });
  res.status(StatusCodes.OK).json({ status: 'success', users });
};

export const showCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { name, lastName, email } = req.body;

  // ! Check if all fields are provided
  if (!name || !lastName || !email) {
    throw new BadRequestError('Please provide all fields');
  }

  // * Validate data with zod
  const validatedData = updateUserSchema.parse(req.body);

  // !Check if user exists
  const user = req.user;
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: validatedData.name,
      lastName: validatedData.lastName,
      email: validatedData.email,
    },
  });

  const tokenUser = createTokenUser(updatedUser);
  const token = attachCookieToResponse(res, tokenUser);

  return res.status(StatusCodes.OK).json({ status: 'success', tokenUser });
};

export const updateUserPassword = async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  // ! Check if all fields are provided
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide all fields');
  }

  // ! Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
  });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // ! Check if password is correct
  const isPasswordCorrect = await checkPassword(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // * Validate data with zod
  const validatedData = updateUserPasswordSchema.parse(req.body);

  // * Update password
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: newPassword,
    },
  });

  res.status(StatusCodes.OK).json({ status: 'success', msg: 'Password updated!' });
};
