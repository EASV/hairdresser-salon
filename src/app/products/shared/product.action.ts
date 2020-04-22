import {Product} from './product';

export class GetAllProducts {
  static readonly type = '[Products] GetAllProducts';

  constructor() {}
}

export class DeleteProduct {
  static readonly type = '[Products] DeleteProduct';

  constructor(public product: Product) {}
}

export class CreateProduct {
  static readonly type = '[Products] CreateProduct';

  constructor(public product: Product) {}
}
