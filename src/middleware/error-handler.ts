import { Request, Response, NextFunction } from 'express';
import { CustomAPIErrorType, CustomError } from '../errors/custom-error';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

const errorHandlerMiddleware = (err: CustomAPIErrorType, req: Request, res: Response, next: NextFunction) => {
  let customError: CustomError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
    status: '',
  };

  if (err instanceof ZodError) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = err.issues.map((issue) => ({ message: issue.message }));
    customError.status = 'failed';
  }

  // ! Duplicate error
  const toUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const duplicateFields = (err?.meta?.target as string[])?.join(', ');
    const errorField = toUpperCase(duplicateFields);
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `${errorField} already exists, please choose another value`;
    // customError.msg = `Duplicate value for field ${duplicateFields}, please choose another value`;
    customError.status = 'failed';
  }
  // ! Cast error (when syntax doesn't match)
  // if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
  //   const errorField = (err?.meta?.target as string[])?.join(', ');
  //   customError.statusCode = StatusCodes.NOT_FOUND;
  //   customError.msg = `No item found with id: ${toUpperCase(errorField)}`;
  // }

  // status property based on statusCode
  customError.status = customError.statusCode.toString().startsWith('4') ? 'failed' : 'error';

  return res.status(customError.statusCode).json({ status: customError.status, msg: customError.msg });
};

export default errorHandlerMiddleware;
