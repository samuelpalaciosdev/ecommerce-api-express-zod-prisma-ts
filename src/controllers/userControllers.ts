import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import prisma from '../services/prisma';
import { AuthenticatedRequest } from '../types/request';
import { attachCookieToResponse, createTokenUser } from '../utils';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(StatusCodes.OK).json({ status: 'success', users });
};

export const showCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { name, lastName, email } = req.body;

  // ! Check if all fields are provided
  if (!name || !lastName) {
    throw new BadRequestError('Please provide all fields');
  }
  // !!!!!!!!!!!!!!!! ERROR, INVALID CREDENTIALS WHEN UPDATE EMAIL

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
      name,
      lastName,
    },
  });

  const tokenUser = createTokenUser(updatedUser);
  const token = attachCookieToResponse(res, tokenUser);

  return res.status(StatusCodes.OK).json({ status: 'success', tokenUser });
};
