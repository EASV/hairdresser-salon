import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../shared/auth.service';
import {map} from 'rxjs/operators';
import {Select} from '@ngxs/store';
import {AuthState} from '../shared/auth.state';
import {AuthUser} from '../shared/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  @Select(AuthState.loggedInUser) loggedInUser$: Observable<AuthUser>;
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
     Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('AuthGuard#canActivate called');
    return this.loggedInUser$.pipe(
        map(authUser => {
          if (authUser === undefined) {
            this.router.navigateByUrl('auth/login');
            return false;
          }
          return authUser !== undefined;
        })
      );
  }
}
