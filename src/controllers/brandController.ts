import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { BadRequestError } from '../errors';
import { brandSchema } from '../types/brand';
import { StatusCodes } from 'http-status-codes';

const createBrand = async (req: Request, res: Response) => {
  const { name, description, logo } = req.body;

  // ! Check if all fields are filled
  if (!name || !description || !logo) {
    throw new BadRequestError('Please provide  all fields');
  }

  // * Validate with zod
  const validatedData = brandSchema.parse(req.body);

  // * Create category
  const brand = await prisma.brand.create({
    data: {
      name: validatedData.name,
      description: validatedData.description,
      logo: validatedData.logo,
    },
  });

  res.status(StatusCodes.CREATED).json({ status: 'success', brand });
};

export default createBrand;
