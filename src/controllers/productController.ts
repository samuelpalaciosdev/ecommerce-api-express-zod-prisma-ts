import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import prisma from '../services/prisma';
import { productSchema } from '../types/product';

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.status(StatusCodes.OK).json({ products });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  // ! Check if product doesn't exist
  if (!id) {
    throw new NotFoundError(`No product with id: ${id}`);
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  res.status(StatusCodes.OK).json({ product });
};

export const createProduct = async (req: Request, res: Response) => {
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
  // * Not checking color because it's optional and featured because is default to false

  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !inventory ||
    !inStock ||
    !brandId ||
    !categoryId
  ) {
    throw new Error('Please provide all required fields');
  }

  // * Validate data with zod
  const validatedData = productSchema.parse(req.body);

  //* Create product
  const product = await prisma.product.create({
    data: {
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      image: validatedData.image,
      color: validatedData.color,
      inventory: validatedData.inventory,
      averageRating: 4,
      featured: validatedData.featured,
      inStock: validatedData.inStock,
      brand: { connect: { id: validatedData.brandId } },
      category: { connect: { id: validatedData.categoryId } },
    },
  });

  res.status(StatusCodes.CREATED).json({ status: 'success', product });
};
