import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(inputEmail: string, inputPass: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCDayOfBCDFvHO8fmYxzLjX_-wCJegtDIY',
        {
          email: inputEmail,
          password: inputPass,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(inputEmail: string, inputPass: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCDayOfBCDFvHO8fmYxzLjX_-wCJegtDIY',
        {
          email: inputEmail,
          password: inputPass,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    console.log(userData);

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpDate)
    );

    if (loadedUser.token) {
      const tokenDuration =
        new Date(userData._tokenExpDate).getTime() - new Date().getTime();

      this.autoLogout(tokenDuration);
      this.user.next(loadedUser);
    }
  }

  logout() {
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  autoLogout(tokenDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, tokenDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, idToken, expDate);

    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
        break;
    }
    return throwError(errorMessage);
  }
}
