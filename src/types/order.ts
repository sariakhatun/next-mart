import { CartItem } from './cart';

export interface Order {
  _id: string;
  transactionId: string;
  userEmail: string;

  cartItems: CartItem[];

  amount: number;
  currency: string;

  status: string;
  paid: boolean;

  paymentMethod: string;

  createdAt: string;
  paidAt?: string;
}
