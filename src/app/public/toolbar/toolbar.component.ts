import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthUser} from '../../auth/shared/auth-user';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {AuthState} from '../../auth/shared/auth.state';
import {Logout} from '../../auth/shared/auth.action';

@Component({
  selector: 'app-innotech-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Select(AuthState.loggedInUser) loggedInUser$: Observable<AuthUser>;
  @Output()
  toggleClicked = new EventEmitter();
  constructor(private router: Router,
              private store: Store) { }

  ngOnInit(): void {
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
