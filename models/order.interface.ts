import { ShortProduct } from "./product.interface";

export interface Order {
  id: string;
  userId: string;
  products: ShortProduct[];
  totalPrice: number;
}
