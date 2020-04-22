import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {GoToRoute} from './route.action';

export class RouteStateModel {
  currentNavigationExtras: NavigationExtras;
  currentRoute: string;
}

@State<RouteStateModel>({
  name: 'route',
  defaults: {
    currentRoute: undefined,
    currentNavigationExtras: undefined
  }
})
@Injectable()
export class RouteState {

  constructor(private router: Router) {}

  @Selector()
  static currentRoute(state: RouteStateModel) {
    return state.currentRoute;
  }

  @Selector()
  static currentNavigationExtras(state: RouteStateModel) {
    return state.currentNavigationExtras;
  }

  @Action(GoToRoute)
  goToRoute({getState, setState}: StateContext<RouteStateModel>, action: GoToRoute) {
    const state = getState();
    setState({
      ...state,
      currentRoute: action.route,
      currentNavigationExtras: action.navExtras
    });
    return this.router.navigateByUrl(action.route, action.navExtras);
  }
}




