import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../models/auth';
import { LoginUser } from '../models/login';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 constructor(private http: HttpClient) { }

  public Login(user: LoginUser): Observable<Auth> {
    return this.http.post<Auth>(`${environment.authapi}/Auth`,user);
  }
}
