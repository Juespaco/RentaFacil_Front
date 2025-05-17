import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../models/role';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private jwtHelper: JwtHelperService;

  public roles = new Subject<Role[]>();

  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  public decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  public getClaim(token: string, claimKey: string): any {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken[claimKey] : null;
  }

  public setRoles(roles: Role[]): void {
    this.roles.next(roles);
  }
  
}
