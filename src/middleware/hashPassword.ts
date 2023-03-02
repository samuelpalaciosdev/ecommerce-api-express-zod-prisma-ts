import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
// import { NextFunction, Request, Response } from 'express';

export const hashPasswordMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
  if ((params.model === 'User' && params.action === 'create') || params.action === 'update') {
    let user = params.args.data;
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      // console.log('hey there encrypting password');
      // console.log('user:', user);
      const hashedPassword = await bcrypt.hash(user.password, salt); // Hash the password
      // console.log('hashedPassword:', hashedPassword);
      user.password = hashedPassword;
    }
  }

  // Call the next middleware function or Prisma method
  return next(params);
};

export const checkPassword = async (candidatePassword: string, userPassword: string) => {
  const isMatch = await bcrypt.compare(candidatePassword, userPassword);
  return isMatch;
};
