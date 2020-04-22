import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {switchMap, take, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RouteState} from '../../public/shared/route.state';
import {GoToRoute} from '../../public/shared/route.action';
import {Product} from './product';
import {ProductService} from './product.service';
import {CreateProduct, DeleteProduct, GetAllProducts} from './product.action';

export class ProductStateModel {
  products: Product[];
  requestSent: boolean;
}

@State<ProductStateModel>({
  name: 'product',
  defaults: {
    products: [],
    requestSent: false
  }
})
@Injectable()
export class ProductState {

  constructor(private productService: ProductService) {}

  @Selector()
  static products(state: ProductStateModel) {
    return state.products;
  }

  @Selector()
  static requestSent(state: ProductStateModel) {
    return state.requestSent;
  }
  @Action(CreateProduct)
  createProduct({getState, setState}: StateContext<ProductStateModel>, action: CreateProduct) {
    const state = getState();
    setState({
      ...state,
      requestSent: true
    });
    return this.productService
      .createProduct(action.product).pipe(
        tap(product => {
          setState({
            ...state,
            requestSent: false
          });
        })
      );
  }

  @Action(GetAllProducts)
  getAllProducts({getState, setState}: StateContext<ProductStateModel>) {
    const state = getState();
    setState({
      ...state,
      requestSent: true
    });
    return this.productService
      .getProducts().pipe(
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts,
            requestSent: false
          });
        })
      );
  }
  @Action(DeleteProduct)
  deleteProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: DeleteProduct) {
    const state = getState();
    setState({
      ...state,
      requestSent: true
    });
    return this.productService
      .deleteProduct(action.product)
      .pipe(
        tap(product => {
          setState({
            ...state,
            requestSent: false
          });
          // dispatch(new GetAllProducts());
        })
      );
  }

}




