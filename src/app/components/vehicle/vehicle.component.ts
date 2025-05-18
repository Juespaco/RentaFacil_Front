import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../models/vehicle';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { vehicleType } from '../../models/vehicleType';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css',
})
export class VehicleComponent {
  vehicles: Vehicle[] = [];
  vehicleForm: Vehicle = new Vehicle();
  buscarID: number = 0;
  editMode = false;
  selectedVehicle: Vehicle | null = null;
  textButton = 'Registrar';
  selectedVehicleIdSearch: string | undefined;
  vehicleTypes: vehicleType[];
  currentPage:number = 1;
  itemsPerPage:number = 5;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.getVehicleTypes();
    this.getVehicles();
  }

  get sortedVehicles(): Vehicle[] {
    return [...this.vehicles].sort((a, b) => {
      const valueA = a[this.sortColumn as keyof Vehicle];
      const valueB = b[this.sortColumn as keyof Vehicle];


      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return this.sortDirection === 'asc'
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    });
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getVehicles() {
    this.vehicleService.getVehicles().subscribe((response) => {
      this.vehicles = response;
    });
  }

  getVehicleTypes() {
    this.vehicleService.getVehicleTypes().subscribe((response) => {
      this.vehicleTypes = response;
    });
  }

  manageRequestForm() {
    if (this.editMode) {
      this.updateVehicle();
    } else {
      this.insertVehicle();
    }
  }

  searchVehicle() {
    this.getVehicles();
  }

  insertVehicle() {
    this.vehicleService.inserVehicle(this.vehicleForm).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          text: 'Vehiculo creado con éxito',
          showConfirmButton: true,
          confirmButtonColor: '#06100D',
        });

        this.getVehicles();
        this.cleanForm();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          text: 'Error al crear Vehiculo',
          showConfirmButton: true,
          confirmButtonColor: '#06100D',
        });
      }
    );
  }

  editVehicle(vehicle: Vehicle) {
    this.editMode = true;
    this.selectedVehicle = vehicle;
    this.vehicleForm = { ...vehicle };
    this.textButton = 'Actualizar';
  }

  updateVehicle() {
    this.vehicleService.updateVehicle(this.vehicleForm).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          text: 'Vehiculo actualizado con éxito',
          showConfirmButton: true,
          confirmButtonColor: '#06100D',
        });

        this.getVehicles();
        this.cleanForm();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          text: 'Error al actualizar Vehiculo',
          showConfirmButton: true,
          confirmButtonColor: '#06100D',
        });
      }
    );
  }

  cleanForm() {
    this.vehicleForm = new Vehicle();
    this.editMode = false;
    this.selectedVehicle = null;
    this.textButton = 'Registrar';
  }

  validateVehicleFields() {
    try {
      if (
        !this.vehicleForm.plateNumber.trim() ||
        !this.vehicleForm.brand.trim() ||
        !this.vehicleForm.model.trim() ||
        !this.vehicleForm.year ||
        !this.vehicleForm.vehicleTypeId ||
        !this.vehicleForm.bookingValuePerDay
      ) {
        Swal.fire({
          icon: 'warning',
          text: 'todos los campos deben estar llenos',
          showConfirmButton: true,
          confirmButtonColor: '#06100D',
        });
        return false;
      } else {
        if (this.editMode) {
          this.updateVehicle();
        } else {
          this.insertVehicle();
        }
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  clear() {
    this.vehicleForm = new Vehicle();
    this.editMode = false;
    this.selectedVehicle = new Vehicle();
    this.textButton = 'Registrar';
  }

  

  get paginatedVehicles(): Vehicle[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.sortedVehicles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.sortedVehicles.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
