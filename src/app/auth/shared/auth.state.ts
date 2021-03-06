import {AuthUser} from './auth-user';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AuthService} from './auth.service';
import {GetRole, LoginWithGoogle, Logout} from './auth.action';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';
import {Role} from './role';

export class AuthStateModel {
  loggedInUser: AuthUser;
  userName: string;
  role: Role;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    loggedInUser: undefined,
    userName: undefined,
    role: undefined
  }
})
@Injectable()
export class AuthState {

  constructor(private authService: AuthService) {}

  @Selector()
  static loggedInUser(state: AuthStateModel) {
    return state.loggedInUser;
  }

  @Selector()
  static role(state: AuthStateModel) {
    return state.role;
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
          ctx.dispatch(new GetRole(result.uid));
        })
      );
  }

  @Action(Logout)
  logout({getState, setState, dispatch}: StateContext<AuthStateModel>) {
    return this.authService.logout()
      .pipe(
        tap((result) => {
          const state = getState();
          setState({
            ...state,
            loggedInUser: undefined,
            userName: undefined
          });
          dispatch(new Navigate([routingConstants.welcome]));
        })
      );
  }

  @Action(GetRole)
  getRole(ctx: StateContext<AuthStateModel>, action: GetRole) {
    const state = ctx.getState();
    return this.authService
      .getRole(action.uid).pipe(
        tap((roleFound) => {
          ctx.setState({
            ...state,
            role: roleFound
          });
        })
      );
  }
}




