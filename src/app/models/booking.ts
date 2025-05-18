import { client } from "./client";
import { Vehicle } from "./vehicle";

export class Booking {
  id: number = 0;
  plateNumber: string = '';
  fullName: string = '';
  startDate: string = '';
  endDate: string = '';
  totalValue: number = 0;
  status: string = '';
  client: client;
  vehicle: Vehicle;
}
