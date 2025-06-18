import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthError, User } from '../../models/user.model';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<boolean>(false);
  public user$ = this.userSubject.asObservable();
  private firebaseUserSubject = new BehaviorSubject<firebase.User | null>(null);
  public firebaseUser$ = this.firebaseUserSubject.asObservable();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (user) {
          this.userSubject.next(true);
          this.firebaseUserSubject.next(user);
        } else {
          this.userSubject.next(false);
          this.firebaseUserSubject.next(null);
        }
      });
    });
  }

  loginUser(credentials: User): Promise<void | AuthError> {
    return this.afAuth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((result) => {
        console.log('Auth Service: loginUser: success');
        this.userSubject.next(true);
        this.firebaseUserSubject.next(result.user);
      })
      .catch((error) => {
        console.error('Auth Service: login error...');
        console.error('error code', error.code);
        console.error('error', error);
        this.userSubject.next(false);
        this.firebaseUserSubject.next(null);
        return { isValid: false, message: error.message };
      });
  }

  signupUser(user: User): Promise<void | AuthError> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        this.firebaseUserSubject.next(result.user);
        result.user?.sendEmailVerification().catch((error) => {
          console.error('Error sending verification email:', error);
        });
      })
      .catch((error) => {
        console.log('Auth Service: signup error', error);
        return { isValid: false, message: error.message };
      });
  }

  logoutUser(): Promise<void> {
    return this.afAuth
      .signOut()
      .then(() => {
        console.log('User logged out');
        this.userSubject.next(false);
        this.firebaseUserSubject.next(null);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
