import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {auth, User} from 'firebase/app';
import {AuthUser} from './auth-user';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afa: AngularFireAuth) {}

  loginGoogle(): Observable<AuthUser> {
    return from(this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider()))
     .pipe(
       map(credentials => this.firebaseUserToAuthUser(credentials.user))
     );
  }

  logout(): Observable<void> {
    return from(this.afa.auth.signOut());
  }

  authUser(): Observable<AuthUser> {
    const authUser$ = this.afa.authState
      .pipe(
        map(credentials => this.firebaseUserToAuthUser(credentials))
      );
    return authUser$;
  }

  private firebaseUserToAuthUser(user: User): AuthUser {
    if (user) {
      return {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email
      };
    }
  }
}
