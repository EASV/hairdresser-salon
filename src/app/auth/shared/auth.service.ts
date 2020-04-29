import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {auth, User} from 'firebase/app';
import {AuthUser} from './auth-user';
import {from, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {firestoreConstants} from '../../public/shared/constants';

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

  getRole(uid: string): Observable<string> {
    return this.fs.doc(
      firestoreConstants.roles +
      firestoreConstants.slash +
      firestoreConstants.admin +
      firestoreConstants.slash + uid)
      .get().pipe(
        first(),
        map(value => {
          const data = value.data();
          return data.role;
        })
      );
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
