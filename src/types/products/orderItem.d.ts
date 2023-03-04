export type OrderItem = {
  id: string;
  quantity: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date | null;
  order: Order;
  orderId: string;
};
