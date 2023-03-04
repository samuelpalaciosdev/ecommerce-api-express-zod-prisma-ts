export type Order = {
  id: string;
  total: number;
  state: string;
  user: User;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  orderItems?: OrderItem[];
};
