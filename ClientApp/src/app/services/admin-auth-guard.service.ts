import { AuthGuard } from './auth-guard.service';
import { AuthService } from '@auth0/auth0-angular';
import { Auth } from './auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard extends AuthGuard {
  constructor(auth: Auth, authService: AuthService) {
    super(auth, authService);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    var isAuthenticated = super.canActivate(route, state);
    return isAuthenticated ? this.auth.isRole('Admin') : false;
  }
}
