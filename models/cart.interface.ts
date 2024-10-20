import { ShortProduct } from "./product.interface";


export interface Cart {
  id: string;
  userId: string;
  products: ShortProduct[];
}
