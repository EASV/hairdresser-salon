import {AuthUser} from './auth-user';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AuthService} from './auth.service';
import {LoginWithGoogle, Logout} from './auth.action';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

export class AuthStateModel {
  loggedInUser: AuthUser;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    loggedInUser: undefined
  }
})
@Injectable()
export class AuthState {

  constructor(private authService: AuthService) {
  }

  @Selector()
  static loggedInUser(state: AuthStateModel) {
    return state.loggedInUser;
  }

  @Action(LoginWithGoogle)
  loginWithGoogle({getState, setState}: StateContext<AuthStateModel>) {
    debugger;
    return this.authService
      .loginGoogle().pipe(
        tap((result) => {
      const state = getState();
      setState({
        ...state,
        loggedInUser: result,
      });
    }));
  }

  @Action(Logout)
  logout({getState, setState}: StateContext<AuthStateModel>) {
    return this.authService.logout()
      .pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        loggedInUser: undefined,
      });
    }));
  }
}




