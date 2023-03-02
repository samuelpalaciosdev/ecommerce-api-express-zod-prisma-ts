import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';
import prisma from '../services/prisma';
import { AuthenticatedRequest } from '../types/request';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(StatusCodes.OK).json({ status: 'success', users });
};

export const showCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { name, lastName } = req.body;

  // ! Check if all fields are passed
  if (!name || !lastName) {
    throw new BadRequestError('Provide all fields, try again');
  }

  const user = req.user;
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      name: 'Actualizado manito',
    },
  });

  res.status(StatusCodes.OK).json({ user: updatedUser });
};
