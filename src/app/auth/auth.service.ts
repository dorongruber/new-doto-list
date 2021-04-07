import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from './user.model';


export interface AuthResponseData {
  email: string;
  userId: string;
  token: string;
  expiresIn: number;
}

// const URI = 'http://localhost:8080/api/user/';
const URI = 'https://guarded-sea-67886.herokuapp.com/api/user/';

@Injectable({providedIn: 'root'})
export class AuthService {

  loadingObs = new Subject<boolean>();
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  Register(name: string, phone: string, email: string, password: string) {
    // console.log('authservice register -> ', name, phone, email, password);
    this.loadingObs.next(true);
    return this.http.post<{message: boolean}>(
      `${URI}register`,
      {
        name,
        phone,
        email,
        password
      }
    );
  }

  Login(email: string, password: string) {
    this.loadingObs.next(true);
    return this.http.post<AuthResponseData>(
      `${URI}loguser`,
      {
        email,
        password
      }
    ).pipe(catchError(this.handleError), tap( resData => {
      console.log('Login authService resData -> ', resData);
      this.handleAuthentication(
        resData.email,
        resData.userId,
        resData.token,
        resData.expiresIn
      );
    }));
  }

  private handleAuthentication(email: string, userId: string, token: string, expiredIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiredIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user);
    this.AutoLogout(expiredIn * 1000);
    console.log('local storage -> ', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'new error in handleError';
    console.log('handle error -> error -> ', errorRes);
    if (errorRes.message || errorRes.error.message) {
      errorMessage = errorRes.error.message;
    }
    return throwError(errorMessage);
  }

  AutoLogin() {

    const userData: {
      name: string;
      pass: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.name,
      userData.pass,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    console.log('loadedUser -> ', loadedUser);
    if ( loadedUser.token ) {
      this.user.next(loadedUser);
      const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() -
      new Date().getTime();
      this.AutoLogout(expirationDuration);
      this.router.navigate(['/main']);
    }

  }

  AutoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.Logout();
    }, expirationDuration);
  }

  Logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if ( this.tokenExpirationTimer ) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

}
