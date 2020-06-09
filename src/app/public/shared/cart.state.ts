import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {CartItem} from './cart-item';
import {AddToCart} from './cart.actions';
import {AuthStateModel} from '../../auth/shared/auth.state';

export class CartStateModel {
  items: CartItem[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: []
  }
})
@Injectable()
export class CartState {

  constructor() {}

  @Selector()
  static cartItems(state: CartStateModel) {
    return state.items;
  }
  @Action(AddToCart)
  addToCart(ctx: StateContext<CartStateModel>, action: AddToCart) {
    const state = ctx.getState();
    const itemsNew = [...state.items];
    itemsNew.push({
      product: action.product,
      count: action.count
    });
    ctx.setState({
      ...state,
      items: itemsNew
    });
  }

}
