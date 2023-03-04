export type Brand = {
  id: string;
  name: string;
  description: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date | null;
  products?: Product[];
};
