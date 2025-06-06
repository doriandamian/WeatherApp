import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthError, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<boolean>(false);
  public user$ = this.userSubject.asObservable();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (user) {
          this.userSubject.next(true);
        } else {
          this.userSubject.next(false);
        }
      });
    });
  }

  loginUser(credentials: User): Promise<void | AuthError> {
    return this.afAuth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
        this.userSubject.next(true);
      })
      .catch((error) => {
        console.error('Auth Service: login error...');
        console.error('error code', error.code);
        console.error('error', error);
        this.userSubject.next(false);
        return { isValid: false, message: error.message };
      });
  }

  signupUser(user: User): Promise<void | AuthError> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
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
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
