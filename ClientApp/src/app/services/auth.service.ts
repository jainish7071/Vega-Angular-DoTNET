import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private helper = new JwtHelperService();
  private raw: any = {};
  private roles: any[] = ['admin'];
  constructor(private auth: AuthService) {
    this.getAccessToken();
  }
  private getAccessToken() {
    this.auth.idTokenClaims$.subscribe((res) => {
      this.raw = this.helper.decodeToken(res?.__raw);
      // this.roles = this.raw['https://vega.com/roles'];
    });
  }
  getUser() {
    return this.raw;
  }
  isRole(role: string) {
    return this.roles.indexOf(role) > -1;
  }
  isAuthorized() {
    return this.auth.isAuthenticated$.subscribe(
      (res) => {
        res;
      },
      (err) => {
        if (err) false;
      }
    );
  }
  getToken() {
    return this.raw._raw;
  }
}
