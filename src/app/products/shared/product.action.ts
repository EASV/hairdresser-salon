import {Product} from './product';

// Get Products 1 time and stop listening
export class GetAllProducts {
  static readonly type = '[Products] GetAllProducts';

  constructor() {}
}

// Stream Products and keep listening
export class StartStreamProducts {
  static readonly type = '[Products] StartStreamProducts';

  constructor() {}
}

// Stop Stream of Products
export class StopStreamProducts {
  static readonly type = '[Products] StopStreamProducts';

  constructor() {}
}

export class DeleteProduct {
  static readonly type = '[Products] DeleteProduct';

  constructor(public product: Product) {}
}

export class CreateProduct {
  static readonly type = '[Products] CreateProduct';

  constructor(public product: Product, public goToOverview?: boolean) {}
}

export class GetProductById {
  static readonly type = '[Products] GetProductById';

  constructor(public uid: string) {}
}
