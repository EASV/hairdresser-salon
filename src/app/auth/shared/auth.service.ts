import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {auth, User} from 'firebase/app';
import {AuthUser} from './auth-user';
import {from, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {AngularFirestore, Query} from '@angular/fire/firestore';
import {firestoreConstants} from '../../public/shared/constants';
import {Role} from './role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afa: AngularFireAuth,
              private fs: AngularFirestore) {}

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

  getRole(uid: string): Observable<Role> {
    return this.fs
      .doc<Role>(firestoreConstants.roles + firestoreConstants.slash + uid)
      .valueChanges().pipe(first());
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
