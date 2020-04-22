import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {AuthState} from '../shared/auth.state';
import {AuthUser} from '../shared/auth-user';
import {Navigate} from '@ngxs/router-plugin';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  @Select(AuthState.loggedInUser)
  authUser$: Observable<AuthUser>;

  constructor(private router: Router,
              private store: Store) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    routeState: RouterStateSnapshot):
     Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authUser$
      .pipe(
        map(authUser => {
          if (authUser === undefined) {
            this.store.dispatch(new Navigate(['auth/login'],
              {redirect: routeState.url}));
            return false;
          }
          return authUser !== undefined;
        })
      );
  }
}
