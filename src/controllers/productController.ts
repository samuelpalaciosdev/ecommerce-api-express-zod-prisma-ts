import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors';
import prisma from '../services/prisma';

const getAllProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.status(200).json({ products });
};

const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  // ! Check if product doesn't exist
  if (!id) {
    throw new NotFoundError(`No product with id: ${id}`);
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  res.status(200).json({ product });
};

const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    image,
    color,
    inventory,
    featured,
    inStock,
    brandId,
    categoryId,
  } = req.body;

  // ! Check if all fields are filled
  // Not checking color because it's optional
  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !inventory ||
    !featured ||
    !inStock ||
    !brandId ||
    !categoryId
  ) {
    throw new BadRequestError('Please provide  all fields');
  }

  // * Validate data with zod

  // const validatedData =
};
