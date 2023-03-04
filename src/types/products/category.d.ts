export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
  products?: Product[];
};
