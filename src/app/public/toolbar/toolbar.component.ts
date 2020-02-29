import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SidenavComponent} from '../sidenav/sidenav.component';
import {AuthService} from '../../auth/shared/auth.service';
import {AuthUser} from '../../auth/shared/auth-user';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-innotech-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  authUser: AuthUser;
  @Output()
  toggleClicked = new EventEmitter();
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.authService.
      authUser()
        .subscribe(user => {
            this.authUser = user;
        });
  }

  toggleNav() {
    this.toggleClicked.emit();
  }

  logout() {
    this.authService.logout();
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

}
