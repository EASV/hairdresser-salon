import {Product} from './product';

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

// Start Stream of Products Details
export class StartStreamProductDetails {
  static readonly type = '[Products] StartStreamProductDetails';

  constructor(public uId: string) {}
}

// Stop Stream of Products Details
export class StopStreamProductDetails {
  static readonly type = '[Products] StopStreamProductDetails';

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

export class UpdateProduct {
  static readonly type = '[Products] UpdateProduct';

  constructor(public product: Product) {}
}
