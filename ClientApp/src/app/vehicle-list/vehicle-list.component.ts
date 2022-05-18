import { AuthService } from '@auth0/auth0-angular';
import { VehicleService } from './../services/vehicle.service';
import { Vehicle, KeyValuePair } from './../models/vehicle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements OnInit {
  private readonly PAGE_SIZE = 3;
  queryResult: any = {};
  // allVehicles: Vehicle[] = [];
  makes: any = [];
  models: any = [];
  query: any = {
    pageSize: this.PAGE_SIZE,
  };
  columns = [
    { title: 'Id' },
    { title: 'Make', key: 'make', isSortable: true },
    { title: 'Model', key: 'model', isSortable: true },
    { title: 'Contact Name', key: 'contactName', isSortable: true },
    {},
  ];
  constructor(
    private vehicleService: VehicleService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.populateVehicles();
    this.vehicleService.getMakes().subscribe((makes) => {
      this.makes = makes;
    });
  }
  // private onFilterChange() {
  // this.populateVehicles();
  // This code is for client side filtering
  // var vehicles = this.allVehicles;
  // if (this.filter.makeId) {
  //   vehicles = vehicles.filter((v) => v.make.id == this.filter.makeId);
  // }
  // if (this.filter.modelId) {
  //   vehicles = vehicles.filter((v) => v.model.id == this.filter.modelId);
  // }
  // this.vehicles = vehicles;
  // }
  private populateModels() {
    var selectedMake = this.makes.find((m: any) => m.id == this.query.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }
  onMakeChange() {
    this.query.page = 1;
    this.populateModels();
    this.populateVehicles();
  }
  onModelChange() {
    this.query.page = 1;
    this.populateVehicles();
  }
  private populateVehicles() {
    this.vehicleService
      .getVehicles(this.query)
      .subscribe((result) => (this.queryResult = result));
  }
  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE,
    };
    this.populateVehicles();
  }
  sortBy(columnName: string) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }
  onPageChange(page: any) {
    this.query.page = page;
    this.populateVehicles();
  }
}
