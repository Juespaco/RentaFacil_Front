import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking';
import { BookingFilters } from '../../models/bookingFilters';


@Component({
  selector: 'app-bookinghistory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css',
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  paginatedBookings: Booking[] = [];

  filterForm: BookingFilters = new BookingFilters();

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.searchBooking();
  }

  searchBooking(): void {
    this.bookingService.getBookingsWithFilters(this.filterForm).subscribe((response: Booking[]) => {
      this.bookings = response || [];
      this.currentPage = 1;
      this.updatePaginatedData();
    });
  }

  clearFilter(): void {
    this.filterForm = new BookingFilters();
    this.searchBooking();
  }

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedBookings = this.bookings.slice(start, end);
    this.totalPages = Math.ceil(this.bookings.length / this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySort();
  }

  applySort(): void {
    const columnPath = this.sortColumn;
    const direction = this.sortDirection;

    const getValue = (obj: any, path: string) =>
      path.split('.').reduce((acc, part) => acc && acc[part], obj);

    this.bookings.sort((a, b) => {
      const valueA = getValue(a, columnPath);
      const valueB = getValue(b, columnPath);

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePaginatedData(); // vuelve a mostrar la página actual
  }

}
