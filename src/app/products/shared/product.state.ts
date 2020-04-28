import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Product} from './product';
import {ProductService} from './product.service';
import {CreateProduct, DeleteProduct, GetAllProducts, StartStreamProducts, StopStreamProducts} from './product.action';
import {Subject} from 'rxjs';
import {Navigate, RouterDataResolved} from '@ngxs/router-plugin';
import {routingConstants, stateKeys} from '../../public/shared/constants';
import {ErrorOccoured} from '../../error/shared/error.action';

export class ProductStateModel {
  products: Product[];
}

@State<ProductStateModel>({
  name: stateKeys.products,
  defaults: {
    products: []
  }
})
@Injectable()
export class ProductState implements NgxsOnInit {
  private stopSteamProducts$: Subject<any>;
  urlsForProductStream = [routingConstants.slash + routingConstants.products,
    routingConstants.slash + routingConstants.products + routingConstants.slash + routingConstants.create
  ];
  constructor(private productService: ProductService,
              private actions: Actions,
              private store: Store) {}

  @Selector()
  static products(state: ProductStateModel) {
    return state.products;
  }

  @Action(CreateProduct)
  createProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: CreateProduct) {
    try {
      this.productService
        .createProduct(action.product)
        .pipe(
          tap(product => {
            if (action.goToOverview) {
              dispatch(new Navigate([routingConstants.products]));
            }
          })
        );
    } catch (e) {
      dispatch(new ErrorOccoured(e));
    }
  }

  @Action(GetAllProducts)
  getAllProducts({getState, setState}: StateContext<ProductStateModel>) {
    const state = getState();
    return this.productService
      .getProducts().pipe(
        first(),
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        })
      );
  }
  @Action(StartStreamProducts)
  streamProducts({getState, setState}: StateContext<ProductStateModel>) {
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
        takeUntil(this.stopSteamProducts$)
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
      .deleteProduct(action.product);
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




