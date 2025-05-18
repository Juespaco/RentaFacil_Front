import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequest } from '../models/bookingRequest';
import { environment } from '../../environments/environment';
import { Booking } from '../models/booking';
import { BookingFilters } from '../models/bookingFilters';

@Injectable({
  providedIn: 'root',
})
export class BookingService {


  constructor(private http: HttpClient) {}

  createBooking(body: BookingRequest): Observable<any> {
    return this.http.post<any>(`${environment.bookingapi}/Booking`, body);
  }

  getBookingsWithFilters(filters: BookingFilters): Observable<Booking[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post<Booking[]>(`${environment.bookingapi}/Booking/GetbookinsWithFilters`, filters, { headers });
}


  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.bookingapi}/Booking`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${environment.bookingapi}/Booking/${id}`);
  }

}
