export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  color?: string | null;
  inStock: boolean;
  brand: Brand;
  brandId: string;
  category: Category;
  categoryId: string;
  Review?: Review[];
  createdAt: Date;
  updatedAt: Date | null;
};
