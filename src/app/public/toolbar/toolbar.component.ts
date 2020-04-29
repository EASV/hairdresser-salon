import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthUser} from '../../auth/shared/auth-user';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {AuthState} from '../../auth/shared/auth.state';
import {Select, Store} from '@ngxs/store';
import {Logout} from '../../auth/shared/auth.action';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorState} from '../../error/shared/error.state';
import {TimedError} from '../../error/shared/timed-error';
import {first} from 'rxjs/operators';
import {ErrorRegisteredByUser} from '../../error/shared/error.action';
import {ErrorComponent} from '../../error/dialog/error.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-innotech-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private errorSubscription: Subscription;
  @Select(ErrorState.errors)
  errors$: Observable<TimedError[]>;
  @Select(AuthState.loggedInUser)
  authUser$: Observable<AuthUser>;
  @Output()
  toggleClicked = new EventEmitter();
  constructor(private store: Store,
              private router: Router,
              private snackBar: MatSnackBar,
              private bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.errorSubscription = this.errors$
      .subscribe(errors => {
        if (errors && errors.length > 0) {
          const nextError = errors[0];
          this.bottomSheet.open(ErrorComponent, {data: {error: nextError}})
            .afterDismissed().pipe(first())
            .subscribe(() => this.store.dispatch(new ErrorRegisteredByUser(nextError)));
        }
      });
  }

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
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
