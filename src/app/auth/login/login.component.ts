import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Select, Store} from '@ngxs/store';
import {LoginWithGoogle} from '../shared/auth.action';
import {Observable} from 'rxjs';
import {AuthUser} from '../shared/auth-user';
import {RouteState} from '../../public/shared/route.state';
import {NavigationExtras} from '@angular/router';

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
  constructor(private store: Store,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {}

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
