import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleComponent } from './vehicle.component';
import { VehicleService } from '../../services/vehicle.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

// Mock simple para VehicleService
class VehicleServiceMock {
  getVehicles() {
    return of([]);
  }
  inserVehicle(vehicle: any) {
    return of({});
  }
  updateVehicle(vehicle: any) {
    return of({});
  }
}

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleComponent],
      providers: [
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('cleanForm should reset the vehicleForm and editMode', () => {
    component.vehicleForm.plateNumber = 'ABC123';
    component.editMode = true;
    component.cleanForm();

    expect(component.vehicleForm.plateNumber).toBe('');
    expect(component.editMode).toBeFalse();
    expect(component.textButton).toBe('Registrar');
  });

  it('validateVehicleFields should return false if required fields are missing', () => {
    component.vehicleForm = {
      plateNumber: '',
      brand: '',
      model: '',
      year: 0,
      vehicleTypeId: 0,
      bookingValuePerDay: 0,
      id: 0
    };
    expect(component.validateVehicleFields()).toBeFalse();
  });

  it('validateVehicleFields should return true if all required fields are set', () => {
    component.vehicleForm = {
      plateNumber: 'ABC123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      vehicleTypeId: 1,
      bookingValuePerDay: 100,
      id: 0
    };
    expect(component.validateVehicleFields()).toBeTrue();
  });

  describe('manageRequestForm', () => {
    it('should call insertVehicle if editMode is false', () => {
      spyOn(component, 'insertVehicle');
      component.editMode = false;
      component.manageRequestForm();
      expect(component.insertVehicle).toHaveBeenCalled();
    });

    it('should call updateVehicle if editMode is true', () => {
      spyOn(component, 'updateVehicle');
      component.editMode = true;
      component.manageRequestForm();
      expect(component.updateVehicle).toHaveBeenCalled();
    });
  });
});
