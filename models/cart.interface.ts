interface ProductInCart {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  products: ProductInCart[];
}
