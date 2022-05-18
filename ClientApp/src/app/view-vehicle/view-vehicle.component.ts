import { AuthService } from '@auth0/auth0-angular';
import {
  BrowserXhrWithProgress,
  ProgressService,
} from './../services/progress.service';
import { PhotoService } from './../services/photo.service';
import { ToastyService } from 'ng2-toasty';
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { XhrFactory } from '@angular/common';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css'],
  providers: [
    { provide: XhrFactory, useClass: BrowserXhrWithProgress },
    ProgressService,
  ],
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = new ElementRef(ViewChild);
  vehicle: any;
  vehicleId: number = 0;
  photos: any[] = [];
  progress: any;

  constructor(
    public auth: AuthService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private photoService: PhotoService,
    private vehicleService: VehicleService,
    private progressService: ProgressService
  ) {
    route.params.subscribe((p) => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit(): void {
    this.vehicleService.getVehicle(this.vehicleId).subscribe(
      (v) => (this.vehicle = v),
      (err) => {
        if (err.status == 404) {
          this.router.navigate(['/vehicles']);
          return;
        }
      }
    );
    this.photoService.getPhotos(this.vehicleId).subscribe((photos: any) => {
      this.photos = photos;
    });
  }
  delete() {
    if (confirm('Are you sure?')) {
      this.vehicleService.delete(this.vehicle.id).subscribe((x) => {
        this.router.navigate(['/vehicles']);
      });
    }
  }
  uploadPhoto() {
    this.progressService.stratTraking().subscribe(
      (progress) => {
        console.log(progress);
        this.zone.run(() => {
          this.progress = progress;
        });
      },
      null,
      () => {
        this.progress = null;
      }
    );
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    if (nativeElement.files) {
      var file = nativeElement.files[0];
      nativeElement.value = '';
      this.photoService.upload(this.vehicleId, file).subscribe(
        (photo) => {
          this.photos.push(photo);
        },
        (err) => {
          this.toasty.error({
            title: 'Error',
            msg: err.error,
            theme: 'default',
            showClose: true,
            timeout: 5000,
          });
        }
      );
    }
  }
}
