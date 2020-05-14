import {Product} from '../../products/shared/product';

export class AddToCart {
  static readonly type = '[Cart] AddToCart';

  constructor(public product: Product, public count: number) {}
}
