import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {catchError, finalize, first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Product} from './product';
import {ProductService} from './product.service';
import {
  CreateProduct,
  DeleteProduct,
  StartStreamProductDetails,
  StartStreamProducts,
  StopStreamProductDetails,
  StopStreamProducts,
  UpdateProduct
} from './product.action';
import {Subject} from 'rxjs';
import {Navigate, RouterDataResolved} from '@ngxs/router-plugin';
import {joinPath, routingConstants, stateKeys} from '../../public/shared/constants';
import {ErrorOccoured} from '../../error/shared/error.action';

export class ProductStateModel {
  products: Product[];
  productDetail: Product;
  updateInProgress: Product;
  updateComplete: Product;
}

@State<ProductStateModel>({
  name: stateKeys.products,
  defaults: {
    products: [],
    productDetail: undefined,
    updateInProgress: undefined,
    updateComplete: undefined
  }
})
@Injectable()
export class ProductState implements NgxsOnInit {
  private stopSteamProducts$: Subject<any>;
  private stopProductDetails$: Subject<any>;
  urlsForProductStream = [
    routingConstants.slash + routingConstants.products,
    routingConstants.slash + routingConstants.products + routingConstants.slash + routingConstants.create
  ];
  urlsForDetailsStream = [
    joinPath(routingConstants.products)
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

  @Selector()
  static updateInProgress(state: ProductStateModel) {
    return state.updateInProgress;
  }

  @Selector()
  static updateComplete(state: ProductStateModel) {
    return state.updateComplete;
  }

  @Action(UpdateProduct)
  updateProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: UpdateProduct) {
    const state = getState();
    setState({
      ...state,
      updateInProgress: action.product
    });
    dispatch(new StopStreamProductDetails());
    return this.productService
      .updateProduct(action.product)
      .pipe(
        first(),
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        }),
        finalize(() => {
          setState({
            ...state,
            updateInProgress: undefined
          });
          dispatch(new StartStreamProductDetails(action.product.uId));
        })
      );
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

  @Action(StartStreamProductDetails)
  startStreamProductDetails({getState, setState, dispatch}: StateContext<ProductStateModel>, action: StartStreamProductDetails) {
    this.stopProductDetails$ = new Subject<void>();
    const state = getState();
    return this.productService
      .getProductById(action.uId).pipe(
        tap(product => {
          setState({
            ...state,
            productDetail: product
          });
        }),
        takeUntil(this.stopProductDetails$),
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        })
      );
  }

  @Action(StopStreamProductDetails)
  stopStreamProductDetails() {
    if (this.stopProductDetails$ != null) {
      this.stopProductDetails$.next();
      this.stopProductDetails$.complete();
      this.stopProductDetails$ = null;
    }
  }

  @Action(DeleteProduct)
  deleteProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: DeleteProduct) {
    return this.productService
      .deleteProduct(action.product).pipe(
        catchError(error => {
          return dispatch(new ErrorOccoured(error));
        }),
        finalize(() => {
          dispatch(new StopStreamProductDetails());
        })
      );
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.actions.pipe(
      ofActionSuccessful(RouterDataResolved)
    ).subscribe((action: RouterDataResolved) => {
      const urlParts = action.event.url.split('/');
      if (urlParts.length > 2 && (urlParts[2] !== routingConstants.create)) {
        if (this.stopSteamProducts$) {
          this.store.dispatch(new StopStreamProducts());
        }
        if (!this.stopProductDetails$) {
          this.store.dispatch(new StartStreamProductDetails(urlParts.length === 3 ? urlParts[2] : urlParts[3]));
        }
      } else if (this.urlsForProductStream.includes(action.event.url )) {
        if (this.stopProductDetails$) {
          this.store.dispatch(new StopStreamProductDetails());
        }
        if (!this.stopSteamProducts$) {
          this.store.dispatch(new StartStreamProducts());
        }
      } else {
        if (this.stopSteamProducts$) {
          this.store.dispatch(new StopStreamProducts());
        }
        if (this.stopProductDetails$) {
          this.store.dispatch(new StopStreamProductDetails());
        }
      }
    });
    return undefined;
  }
}




