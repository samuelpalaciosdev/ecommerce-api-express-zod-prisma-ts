import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import prisma from '../services/prisma';

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

  const user = await prisma.user.create({
    data: {
      name,
      lastName,
      email,
      password,
      role,
    },
  });

  return res.status(StatusCodes.CREATED).json({ status: 'success', user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // ! Check if all fields are filled
  if (!email || !password) {
    throw new BadRequestError('Provide all fields, try again');
  }

  // ! Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // * Login user
  res.status(StatusCodes.OK).json({ status: 'success', user });
};
