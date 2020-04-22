import {AuthUser} from './auth-user';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AuthService} from './auth.service';
import {LoginWithGoogle, Logout} from './auth.action';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

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

  constructor(private authService: AuthService) {}

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




