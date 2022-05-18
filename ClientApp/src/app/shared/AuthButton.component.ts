import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <a
        class="nav-link text-dark"
        (click)="auth.logout({ returnTo: document.location.origin })"
      >
        Log out
      </a>
    </ng-container>

    <ng-template #loggedOut>
      <a class="nav-link text-dark" (click)="auth.loginWithRedirect()">
        Log in
      </a>
    </ng-template>
  `,
  styles: [],
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {
    auth.idTokenClaims$.subscribe((res) => console.log(res));
  }
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ii1hX3NzdUJwdWFPRjh0ZW5GTmc3ayJ9.eyJuaWNrbmFtZSI6ImphaW5pc2gyIiwibmFtZSI6ImphaW5pc2giLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNDk5YzZlMTI2MWIxY2I2OWMwN2IwODE2MTAyNzVlMjA_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqYS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMi0wMi0xMFQxMDoxOTo1OC41MDNaIiwiZW1haWwiOiJqYWluaXNoMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LTNsN2gycGNyLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MjA0Y2E1MDJhZWIyYjAwNzA0ZWI2YzkiLCJhdWQiOiJlTWg4akQzWlIzcTk1cGc4YlZlNnVDTHpBQlYwWm5FVSIsImlhdCI6MTY0NDQ4OTU0NywiZXhwIjoxNjQ0NTI1NTQ3LCJub25jZSI6ImVEYzVTRFV5YlhCK05IaFBlVWsyVmtKVGVtWm1PRXg2WkRNNFdGcHlYMkY2U2xONVVuUTJNRlYxTXc9PSJ9.mmMoKE31PA3cAB0BssJWKZoC82byZ0lVtO3J0Ht-EYWaIHQ0-skMnoA5liSGHH4JL9z7n5I16DhaLiNGogYkZ7whFIrpi5v4V4YqzIKUdVKlWeWxFL5CQMXheO8VfElsEyevQtqIJ65H1_Q4tP_rSEhu9KSLhIQM4LwPhWR8Fp-7rnREMHuc-LOFc7FcYm68nEbNrHFuC3qMv70E9KqJ99VXw_75bRUOyjylXiek2VV586noQHk_U1UprePbuJD4YNpkY280XuJyN3FIunlcIvdFuTyrrvkv6U-fYoZ0uwt70haFTVpAeNDKM304_3oLn4PPKrRl9M1h8d0TT2HRtA"
}
