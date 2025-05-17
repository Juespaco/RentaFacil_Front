import { Component, AfterViewInit } from '@angular/core';
import flatpickr from 'flatpickr';
import { VehicleService } from '../../services/vehicle.service';
import { vehicleType } from '../../models/vehicleType';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/vehicle';
import { vehicleAvailability } from '../../models/vehicleAvailability';
import { ClientService } from '../../services/client.service';
import { client } from '../../models/client';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements AfterViewInit {

  vehicleAvailability: vehicleAvailability = new vehicleAvailability();
  currentStep: number = 1;
  vehicleTypes: vehicleType[];
  availableVehicles: Vehicle[];
  selectedVehicleId: number = 0;
  client: client = new client();


  constructor(
    private vehicleService:VehicleService,
    private clientService:ClientService
  ){
    this.getVehicleTypes();
  }
  ngAfterViewInit(): void {
    flatpickr("#rangoFechas", {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      locale: {
        firstDayOfWeek: 1 // lunes
      },
      onChange: (selectedDates, dateStr) => {
        const dates = dateStr.split(" to ");
        this.vehicleAvailability.StartDate = dates[0];
        this.vehicleAvailability.EndDate = dates[1] || dates[0];
        this.getAvailableVehicles();
      }
    });

    this.updateIndicators(1);
  }

  updateIndicators(currentStep: number) {
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById('indicator-' + i);
      if (el) {
        el.classList.remove('active');
        if (i === currentStep) {
          el.classList.add('active');
        }
      }
    }
  }

  nextStep(step: number) {
    this.toggleSteps(step);
  }

  prevStep(step: number) {
    this.toggleSteps(step);
  }

  toggleSteps(step: number) {
    this.currentStep = step;

    document.querySelectorAll('[id^="step-"]').forEach(div => {
      div.classList.add('d-none');
      div.classList.remove('show');
    });

    const currentStep = document.getElementById('step-' + step);
    if (currentStep) {
      currentStep.classList.remove('d-none');
      setTimeout(() => currentStep.classList.add('show'), 10);
    }

    this.updateIndicators(step);

    if (step === 3) {
      const tipoVehiculo = (document.getElementById('tipoVehiculo') as HTMLSelectElement)?.value;
      const nombre = (document.getElementById('nombre') as HTMLInputElement)?.value;
      const telefono = (document.getElementById('telefono') as HTMLInputElement)?.value;
      const email = (document.getElementById('email') as HTMLInputElement)?.value;

      const desde = this.vehicleAvailability.StartDate;
      const hasta = this.vehicleAvailability.EndDate;

      var vehicle = this.availableVehicles.find(x => x.id == this.selectedVehicleId);
      var value = 0
      if(vehicle){
        value = this.getDaysBetweenDates(this.vehicleAvailability.StartDate,this.vehicleAvailability.EndDate) * vehicle?.bookingValuePerDay;
      }

      document.getElementById('resumenTipo')!.textContent = ` ${vehicle?.brand} - ${vehicle?.model} - ${vehicle?.year} `;
      document.getElementById('resumenFechas')!.textContent = ` ${desde} - ${hasta}`;
      document.getElementById('resumenCliente')!.textContent = ` ${nombre}, ${telefono}, ${email}`;
      document.getElementById('resumenValor')!.textContent = ` $${value}`;
    }
  }

  confirmarReserva() {
    alert("Reserva confirmada. Aquí puedes enviar los datos al backend.");
    // Aquí iría la lógica para guardar la reserva
  }

  getVehicleTypes() {
    this.vehicleService.getVehicleTypes().subscribe((response) => {
      this.vehicleTypes = response;
    });
  }

  getAvailableVehicles(){
    this.selectedVehicleId = 0;
    if(this.vehicleAvailability.StartDate && this.vehicleAvailability.EndDate && this.vehicleAvailability.VehicleType){
      this.vehicleService.GetAvailableVehicles(this.vehicleAvailability).subscribe((response) => {
        this.availableVehicles = response;
      });
    }
  }

  getClientByDocument(){
    this.clientService.getClientByDocument(this.client.document).subscribe((response) => {
      if(response){
        this.client = response;
      }else{
        this.client.email = ''
        this.client.phone = ''
        this.client.fullName = ''
        this.client.id = 0
      }
    });
  }

  getDaysBetweenDates(date1: string, date2: string): number {
    const start = new Date(date1);
    const end = new Date(date2);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays + 1 ;
  }
}