import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SidenavComponent} from '../sidenav/sidenav.component';
import {AuthService} from '../../auth/shared/auth.service';
import {AuthUser} from '../../auth/shared/auth-user';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {AuthState} from '../../auth/shared/auth.state';
import {Select, Store} from '@ngxs/store';
import {Logout} from '../../auth/shared/auth.action';
import {ProductState} from '../../products/shared/product.state';
import {Product} from '../../products/shared/product';
import {GetAllProducts} from '../../products/shared/product.action';

@Component({
  selector: 'app-innotech-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Select(ProductState.products)
  products$: Observable<Product[]>;
  @Select(AuthState.loggedInUser)
  authUser$: Observable<AuthUser>;
  @Output()
  toggleClicked = new EventEmitter();
  constructor(private store: Store,
              private router: Router) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllProducts());
  }

  toggleNav() {
    this.toggleClicked.emit();
  }

  logout() {
    this.store.dispatch(new Logout());
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
