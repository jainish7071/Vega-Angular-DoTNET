import { SaveVehicle, Vehicle, KeyValuePair } from './../models/vehicle';
import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable()
export class VehicleService {
  private readonly JSON_WEB_TOKEN =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ii1hX3NzdUJwdWFPRjh0ZW5GTmc3ayJ9.eyJpc3MiOiJodHRwczovL2Rldi0zbDdoMnBjci51cy5hdXRoMC5jb20vIiwic3ViIjoiT3JoRUNYMFdIeGZ6VHVlaVBQdzlaTFV2S2lnUzNPQTZAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLnZlZ2EuY29tIiwiaWF0IjoxNjQ0NDkwODI2LCJleHAiOjE2NDQ1NzcyMjYsImF6cCI6Ik9yaEVDWDBXSHhmelR1ZWlQUHc5WkxVdktpZ1MzT0E2IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.iCvFJ0-FqCY2uKf6b7AlN4yNhaPY21QGr7Uu_TvOdAnSE1gnxanh3zl0HKfNua2qXxfFRzup-l7w5nHzojJLAej8iVNv2OWKWZn5Tb5iLHPdC6Wetpno5sd7B8wzWlsNQ-HFSHouJdjfjuJVjMzkXna3KwJhe_mOHOlyQIx2HMD9Ol3Ad4e9AfwSeINsuyA2Eo_5nKytrcNrAgPW95MFtr8NfgPpCXwR35BQhwndJjeGTwtQyFFxEA9tDf25nFKWjoLmiscNPBRbU9Ob9OcUcWGk2ZMRhp3lqQlVYejv8cleexAYSFujg7KymJTh-sVsPP7XDGzSEppsVRkld1p44A';
  header = new HttpHeaders();
  constructor(private http: HttpClient) {
    this.header.append('Authorization', `Berear ${this.JSON_WEB_TOKEN}`);
  }

  getMakes() {
    return this.http.get('/api/makes').pipe(catchError(this.handleError));
  }

  getFeatures() {
    return this.http.get('/api/features').pipe(catchError(this.handleError));
  }

  create(vehicle: SaveVehicle) {
    return this.http
      .post('/api/vehicles', vehicle, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  getVehicle(id: any) {
    return this.http
      .get('/api/vehicles/' + id)
      .pipe(catchError(this.handleError));
  }

  update(vehicle: SaveVehicle) {
    return this.http
      .put('/api/vehicles/' + vehicle.id, vehicle, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  delete(id: number) {
    return this.http
      .delete('/api/vehicles/' + id, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  getVehicles(filter: any) {
    return this.http
      .get('/api/vehicles?' + this.toQueryString(filter))
      .pipe(catchError(this.handleError));
  }
  private toQueryString(obj: any) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined) {
        parts.push(
          encodeURIComponent(property) + '=' + encodeURIComponent(value)
        );
      }
    }
    return parts.join('&');
  }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }
}
