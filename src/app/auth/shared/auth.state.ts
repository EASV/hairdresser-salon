import {AuthUser} from './auth-user';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {AuthService} from './auth.service';
import {LoginWithGoogle, Logout} from './auth.action';
import {switchMap, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RouteState} from '../../public/shared/route.state';
import {GoToRoute} from '../../public/shared/route.action';

export class AuthStateModel {
  loggedInUser: AuthUser;
  userName: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    loggedInUser: undefined,
    userName: undefined
  }
})
@Injectable()
export class AuthState {

  constructor(private authService: AuthService, private store: Store) {}

  @Selector()
  static loggedInUser(state: AuthStateModel) {
    return state.loggedInUser;
  }

  @Selector()
  static loggedInUserName(state: AuthStateModel) {
    return state.userName;
  }

  @Action(LoginWithGoogle)
  loginWithGoogle(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();
    return this.authService
      .loginGoogle().pipe(
        tap((result) => {
          ctx.setState({
            ...state,
            loggedInUser: result,
            userName: result.displayName
          });
          const navigationExtras = this.store.selectSnapshot(RouteState.currentNavigationExtras);
          ctx.dispatch(new GoToRoute(navigationExtras.queryParams.redirect, navigationExtras));
        })
      );
  }

  @Action(Logout)
  logout({getState, setState}: StateContext<AuthStateModel>) {
    return this.authService.logout()
      .pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        loggedInUser: undefined,
        userName: undefined
      });
    }));
  }
}




