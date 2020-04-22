import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Select, Store} from '@ngxs/store';
import {LoginWithGoogle} from '../shared/auth.action';
import {Observable} from 'rxjs';
import {AuthState} from '../shared/auth.state';
import {AuthUser} from '../shared/auth-user';
import {ActivatedRoute} from '@angular/router';
import {first, take, tap} from 'rxjs/operators';
import {Navigate} from '@ngxs/router-plugin';

@Component({
  selector: 'app-innotech-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  @Select(AuthState.loggedInUser)
  loggedInUser$: Observable<AuthUser>;
  constructor(private store: Store,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const redirectString = 'redirect';
    this.route.queryParams.pipe(first())
      .subscribe(params => {
        const sub = this.loggedInUser$.pipe(
          tap(user => {
            if (user) {
              // unsubscribe myself when I got user.
              sub.unsubscribe();
              // send me to redirect or home
              const redirect = params[redirectString];
              if (redirect) {
                this.store.dispatch(new Navigate([redirect]));
              } else {
                this.store.dispatch(new Navigate(['welcome']));
              }
            }
          })
        ).subscribe();
      });
  }

  loginWithEmail() {
    this.notImplemented();
  }

  loginWithGoogle() {
    this.store.dispatch(new LoginWithGoogle());
  }

  loginWithFaceBook() {
    this.notImplemented();
  }

  loginWithTwitter() {
    this.notImplemented();
  }

  forgotPassword() {
    this.snackBar.open(
      'Good luck, chump',
      'Ok',
      {verticalPosition: 'top', duration: 4000});
  }

  private notImplemented() {
    this.snackBar.open(
      'login with email not implemented yet, try google',
      'Ok',
      {verticalPosition: 'top', duration: 4000});
  }
}
