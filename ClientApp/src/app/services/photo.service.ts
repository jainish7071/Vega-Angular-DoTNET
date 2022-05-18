import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PhotoService {
  constructor(private http: HttpClient) {}

  upload(vehicleId: number, photo: any) {
    var formData = new FormData();
    formData.append('file', photo);
    return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getPhotos(vehicleId: number) {
    return this.http.get(`/api/vehicles/${vehicleId}/photos`).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
