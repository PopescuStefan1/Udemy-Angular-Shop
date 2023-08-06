import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(inputEmail: string, inputPass: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCDayOfBCDFvHO8fmYxzLjX_-wCJegtDIY',
      {
        email: inputEmail,
        password: inputPass,
        returnSecureToken: true,
      }
    );
  }
}
