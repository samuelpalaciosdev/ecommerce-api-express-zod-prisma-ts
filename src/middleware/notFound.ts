import { Request, Response } from 'express';

const notFound = (req: Request, res: Response) => {
  return res.status(404).send(`Route does not exist ${req.originalUrl}`);
};

export default notFound;
