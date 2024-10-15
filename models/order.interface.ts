interface ProductInOrder {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  products: ProductInOrder[];
  totalPrice: number;
}
