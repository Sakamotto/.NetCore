import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL: string = 'http://localhost:5000/api/user';
  private jwtHelper = new JwtHelperService();
  public decodedToken: any;

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<any> {
    return this.http
      .post(`${this.baseURL}/login`, model).pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
          }
        })
      );
  }

  public register(model: any): Observable<any> {
    return this.http.post(`${this.baseURL}/register`, model);
  }

  public loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }


}
