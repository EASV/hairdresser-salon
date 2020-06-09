import {Product} from '../../products/shared/product';

export interface CartItem {
  product: Product;
  count: number;
}
