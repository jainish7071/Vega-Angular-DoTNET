import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthButtonComponent } from './shared/AuthButton.component';
import { PaginationComponent } from './shared/pagination.component';
import * as Raven from 'raven-js';
import { AppErrorHandler } from './app.error-handler';
import { ToastyModule } from 'ng2-toasty';
import { VehicleService } from './services/vehicle.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-chartjs';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';
import { PhotoService } from './services/photo.service';
import { AuthModule } from '@auth0/auth0-angular';
import { AdminComponent } from './admin/admin.component';
import { Auth } from './services/auth.service';

Raven.config(
  'https://7f2bb4c40e2443cbb86fb377a82175eb@o1137615.ingest.sentry.io/6190597'
).install();

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    VehicleFormComponent,
    VehicleListComponent,
    PaginationComponent,
    ViewVehicleComponent,
    AuthButtonComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ChartModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'vehicles',
        pathMatch: 'full',
      },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      {
        path: 'vehicle/new',
        component: VehicleFormComponent,
        // canActivate : [AuthGuard]
      },
      {
        path: 'vehicles/edit/:id',
        component: VehicleFormComponent,
        // canActivate:[AuthGuard]
      },
      { path: 'vehicles/:id', component: ViewVehicleComponent },
      { path: 'vehicles', component: VehicleListComponent },
      {
        path: 'admin',
        component: AdminComponent,
        // canActivate: [AdminAuthGuard],
      },
    ]),
    ToastyModule.forRoot(),
    FormsModule,
    AuthModule.forRoot({
      domain: 'dev-3l7h2pcr.us.auth0.com',
      clientId: 'eMh8jD3ZR3q95pg8bVe6uCLzABV0ZnEU',
    }),
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    VehicleService,
    PhotoService,
    Auth,
    AuthGuard,
    AdminAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
