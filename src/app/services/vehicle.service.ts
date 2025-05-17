import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle';
import { environment } from '../../environments/environment.development';
import { vehicleType } from '../models/vehicleType';
import { vehicleAvailability } from '../models/vehicleAvailability';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  public getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${environment.vehicleapi}/Vehicle`);
  }

  public inserVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${environment.vehicleapi}/Vehicle`,vehicle);
  }

  public updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${environment.vehicleapi}/Vehicle`,vehicle);
  }

  public getVehicleTypes(): Observable<vehicleType[]> {
    return this.http.get<vehicleType[]>(`${environment.vehicleapi}/Vehicle/GetVehicleTypes`);
  }

  public GetAvailableVehicles(vehicleAvailability: vehicleAvailability): Observable<Vehicle[]> {
    return this.http.post<Vehicle[]>(`${environment.vehicleapi}/Vehicle/GetAvailable`,vehicleAvailability);
  }
}
