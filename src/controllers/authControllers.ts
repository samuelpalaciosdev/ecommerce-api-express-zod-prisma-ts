import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import prisma from '../services/prisma';
import { attachCookieToResponse, createTokenUser } from '../utils';
import { checkPassword } from '../middleware/hashPassword';
import { loginSchema, registerSchema } from '../types/auth';

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

  console.log(user);

  const tokenUser = createTokenUser(user);
  const token = attachCookieToResponse(res, tokenUser);

  return res.status(StatusCodes.CREATED).json({ status: 'success', tokenUser });
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

  console.log(user);

  const tokenUser = createTokenUser(user);
  const token = attachCookieToResponse(res, tokenUser);

  return res.status(StatusCodes.CREATED).json({ status: 'success', tokenUser });
};
