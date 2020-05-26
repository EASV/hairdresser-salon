import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {catchError, first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Product} from './product';
import {ProductService} from './product.service';
import {CreateProduct, DeleteProduct, GetAllProducts, GetProductById, StartStreamProducts, StopStreamProducts} from './product.action';
import {Subject} from 'rxjs';
import {Navigate, RouterDataResolved} from '@ngxs/router-plugin';
import {routingConstants, stateKeys} from '../../public/shared/constants';
import {ErrorOccoured} from '../../error/shared/error.action';

export class ProductStateModel {
  products: Product[];
  productDetail: Product;
}

@State<ProductStateModel>({
  name: stateKeys.products,
  defaults: {
    products: [],
    productDetail: undefined
  }
})
@Injectable()
export class ProductState implements NgxsOnInit {
  private stopSteamProducts$: Subject<any>;
  urlsForProductStream = [
    routingConstants.slash + routingConstants.products,
    routingConstants.slash + routingConstants.products + routingConstants.slash + routingConstants.create
  ];
  constructor(private productService: ProductService,
              private actions: Actions,
              private store: Store) {}

  @Selector()
  static products(state: ProductStateModel) {
    return state.products;
  }

  @Selector()
  static productDetail(state: ProductStateModel) {
    return state.productDetail;
  }

  @Action(CreateProduct)
  createProduct({getState, dispatch}: StateContext<ProductStateModel>, action: CreateProduct) {
    return this.productService
      .createProduct(action.product)
      .pipe(
        tap(product => {
          if (action.goToOverview) {
            dispatch(new Navigate([routingConstants.products]));
          }
        }),
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        })
      );
  }

  @Action(GetProductById)
  getProductById({getState, setState, dispatch}: StateContext<ProductStateModel>, action: GetProductById ) {
    const state = getState();
    // Get local representation for instant access
    const productDetail = state.products.find(prod => prod.uId === action.uid)
    if (productDetail) {
      setState({
        ...state,
        productDetail
      });
    }
    return this.productService
      .getProductById(action.uid).pipe(
        first(),
        tap(product => {
          setState({
            ...state,
            productDetail: product
          });
        }),
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        })
      );
  }

  @Action(GetAllProducts)
  getAllProducts({getState, setState, dispatch}: StateContext<ProductStateModel>) {
    const state = getState();
    return this.productService
      .getProducts().pipe(
        first(),
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        }),
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        })
      );
  }

  @Action(StartStreamProducts)
  streamProducts({getState, setState, dispatch}: StateContext<ProductStateModel>) {
    this.stopSteamProducts$ = new Subject<void>();
    const state = getState();
    return this.productService
      .getProducts().pipe(
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        }),
        takeUntil(this.stopSteamProducts$),
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        })
      );
  }

  @Action(StopStreamProducts)
  stopStreamProducts() {
    if (this.stopSteamProducts$ != null) {
      this.stopSteamProducts$.next();
      this.stopSteamProducts$.complete();
      this.stopSteamProducts$ = null;
    }
  }

  @Action(DeleteProduct)
  deleteProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: DeleteProduct) {
    return this.productService
      .deleteProduct(action.product).pipe(
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        })
      );
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.actions.pipe(
      ofActionSuccessful(RouterDataResolved)
    ).subscribe((action: RouterDataResolved) => {
      if (this.urlsForProductStream.includes(action.event.url )) {
        if (!this.stopSteamProducts$) {
          this.store.dispatch(new StartStreamProducts());
        }
      } else {
        if (this.stopSteamProducts$) {
          this.store.dispatch(new StopStreamProducts());
        }
      }
    });
    return undefined;
  }
}




