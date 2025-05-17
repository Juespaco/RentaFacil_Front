import { Routes } from '@angular/router';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { LoginComponent } from './components/login/login.component';
import { BookingComponent } from './components/booking/booking.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'vehicle', component: VehicleComponent},
    {path: 'login', component: LoginComponent},
    {path: 'booking', component: BookingComponent},
    {path: 'booking-history', component: BookingHistoryComponent},
];
