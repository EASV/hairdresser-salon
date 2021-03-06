import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {AuthState} from '../shared/auth.state';
import {AuthUser} from '../shared/auth-user';
import {map} from 'rxjs/operators';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';
import {Role} from '../shared/role';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  @Select(AuthState.role)
  role$: Observable<Role>;

  constructor(private router: Router,
              private store: Store) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$
      .pipe(
        map(role => {
          if (role === undefined || role.name !== 'admin') {
            this.store.dispatch(new Navigate([routingConstants.authLogin],
              {redirect: state.url}));
            return false;
          }
          return role !== undefined && role.name === 'admin';
        })
      );
  }

}
