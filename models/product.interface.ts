export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

export interface ShortProduct {
  productId: string;
  quantity: number;
}