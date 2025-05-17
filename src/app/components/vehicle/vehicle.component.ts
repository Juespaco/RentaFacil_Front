import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../models/vehicle';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import 'datatables.net';
import { VehicleService } from '../../services/vehicle.service';
declare var $: any;

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css',
})
export class VehicleComponent {
  vehiclesToSearch: Vehicle[] = [];
  vehicles: Vehicle[] = [];
  vehicleForm: Vehicle = new Vehicle();
  buscarID: number = 0;
  editMode = false;
  selectedVehicle: Vehicle | null = null;
  textButton = 'Registrar';
  selectedVehicleIdSearch: string | undefined;

  constructor(
    private vehicleService:VehicleService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.getVehicles();
  }

  manageRequestForm() {
    if (this.editMode) {
      // Modo de edición
      this.updateVehicle();
    } else {
      // Modo de creación
      this.insertVehicle();
    }
  }

  searchVehicle() {
    this.getVehicles();
  }

  getVehicles() {
    this.vehicleService.getVehicles().subscribe((response) => {
      this.vehicles = response;

      setTimeout(() => {
        // const table = $('#vehicleTable').DataTable();
        // if (table) {
        //   table.destroy();
        // }

        setTimeout(() => {
          $('#vehicleTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
            language: {
              decimal: '',
              emptyTable: 'No hay información',
              info: 'Mostrando _START_ a _END_ de _TOTAL_ Entradas',
              infoEmpty: 'Mostrando 0 a 0 de 0 Entradas',
              infoFiltered: '(Filtrado de _MAX_ total entradas)',
              infoPostFix: '',
              thousands: ',',
              lengthMenu: 'Mostrar _MENU_ Entradas',
              loadingRecords: 'Cargando...',
              processing: 'Procesando...',
              search: 'Buscar:',
              zeroRecords: 'Sin resultados encontrados',
              paginate: {
                first: '<<',
                last: '>>',
                next: '>',
                previous: '<',
              },
            },
          });
        }, 0);
      }, 0);
    });
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

  /**
   * Llena el formulario con los datos del usuario seleccionado
   * @param vehicle
   */
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

  /**
   * Limpia los campos del formulario y resetea nombre de boton a Registrar
   */
  cleanForm() {
    this.vehicleForm.plateNumber = '';
    this.vehicleForm.brand = '';
    this.vehicleForm.model = '';
    this.vehicleForm.year = 0;
    this.vehicleForm.vehicleTypeId = 0;
    this.vehicleForm.bookingValuePerDay = 0;
    this.editMode = false;
    this.selectedVehicle = null;
    this.textButton = 'Registrar';
  }

  validateVehicleFields() {
    try {
      if (
        !this.vehicleForm.plateNumber.trim()||
        !this.vehicleForm.brand.trim() ||
        !this.vehicleForm.model.trim() ||
        !this.vehicleForm.year ||
        !this.vehicleForm.vehicleTypeId ||
        !this.vehicleForm.bookingValuePerDay 
      ) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  deleteVehicle(idVehicle: number) {
    var Vehicle = this.vehicles.find((Vehicle) => Vehicle.id === idVehicle);
    Swal.fire({
      title: 'Eliminar usuario',
      text: 'Deseas eliminar a ' + Vehicle?.plateNumber + '?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonColor: '#06100D',
    }).then((result) => {
      if (result.isConfirmed) {
        /*this.VehicleService.deleteVehicle(idVehicle).subscribe(
          (response) => {
            Swal.fire({
              title: 'Eliminado correctamente!',
              text: 'El usuario ha sido eliminado',
              icon: 'success',
              confirmButtonColor: '#06100D',
            });
            this.getVehicles(); // Actualiza la lista después de eliminar un usuario
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              text: 'No se pudo eliminar el usuario',
              showConfirmButton: true,
              confirmButtonColor: '#06100D',
            });
          }
        );*/
      }
    });
  }

  validateVehicle() {}

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  clear() {
    this.vehicleForm = new Vehicle();
    this.editMode = false;
    this.selectedVehicle = new Vehicle();
    this.textButton = 'Registrar';
  }
}
