import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';
import prisma from '../services/prisma';
import { AuthenticatedRequest } from '../types/request';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  console.log(req.user);
  const users = await prisma.user.findMany();
  res.status(StatusCodes.OK).json({ status: 'success', users });
};

export const showCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  console.log(req.user);
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }
  const id = user.id;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: 'Actualizar',
      },
    });

    // console.log(updatedUser);

    res.status(StatusCodes.OK).json({ user: updatedUser });
  } catch (error) {
    // console.error(error);
    throw new BadRequestError('Error updating user');
  }
};
