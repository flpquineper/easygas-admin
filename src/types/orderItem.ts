import { Product } from './product';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number; 
  product: Product;
}