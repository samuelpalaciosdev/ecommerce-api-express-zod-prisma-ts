import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';
import prisma from '../services/prisma';
import { categorySchema } from '../types/products/category';

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // ! Check if all fields are filled
  if (!name || !description) {
    throw new BadRequestError('Please provide  all fields');
  }

  // * Validate with zod
  const validatedData = categorySchema.parse(req.body);

  // * Create category
  const category = await prisma.category.create({
    data: {
      name: validatedData.name,
      description: validatedData.description,
    },
  });

  res.status(StatusCodes.CREATED).json({ status: 'success', category });
};
