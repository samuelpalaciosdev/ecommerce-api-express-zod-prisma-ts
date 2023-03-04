export type Review = {
  id: number;
  title: string;
  description?: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date | null;
  user: User;
  userId: string;
  product: Product;
  productId: number;
};
