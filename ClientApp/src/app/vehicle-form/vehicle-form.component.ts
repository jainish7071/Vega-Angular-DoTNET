import { ToastyService } from 'ng2-toasty';
import * as _ from 'underscore';
import { SaveVehicle, Vehicle } from './../models/vehicle';
import { Observable } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/forkJoin';
@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css'],
})
export class VehicleFormComponent implements OnInit {
  makes: any = '';
  models: any = '';
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: { name: '', phone: '', email: '' },
  };
  features: any = '';

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService
  ) {
    route.params.subscribe((p) => {
      this.vehicle.id = +p['id'] || 0;
    });
  }

  ngOnInit(): void {
    var sources: any = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
    ];
    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));
    Observable.forkJoin(sources).subscribe(
      (data: any) => {
        this.makes = data[0];
        this.features = data[1];
        if (this.vehicle.id) {
          this.setVehicle(data[2]);
          this.populateModels();
        }
      },
      (err) => {
        if (err.status == 404) this.router.navigate(['/']);
      }
    );
    // this.vehicleService.getVehicle(this.vehicle.id).subscribe(
    //   (v) => {
    //     this.vehicle = v;
    //   },
    //   (err) => {
    //     if (err.status == 404) this.router.navigate(['/home']);
    //   }
    // );
    // this.vehicleService.getMakes().subscribe((makes) => {
    //   this.makes = makes;
    //   this.vehicleService.getFeatures().subscribe((features) => {
    //     this.features = features;
    //   });
    // });
  }
  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  }
  onMakeChange() {
    this.populateModels();
    this.vehicle.modelId = 0;
  }

  private populateModels() {
    var selectedMake = this.makes.find((m: any) => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId: any, $event: any) {
    if ($event.target.checked) {
      this.vehicle.features.push(featureId);
    } else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }
  submit() {
    var result$ = this.vehicle.id
      ? this.vehicleService.update(this.vehicle)
      : this.vehicleService.create(this.vehicle);

    result$.subscribe((vehicle: any) => {
      this.toastyService.success({
        title: 'Success',
        msg: 'The Vehicle was successfully updated.',
        theme: 'default',
        showClose: true,
        timeout: 5000,
      });
      this.router.navigate(['/vehicles/', vehicle.id]);
    });
  }
}
