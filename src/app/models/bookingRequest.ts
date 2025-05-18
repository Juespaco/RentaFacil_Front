import { client } from "./client";

export class BookingRequest {
  vehicleId:  number;  
  startDate:  string;  
  endDate:    string;  
  client:     client; 
  employeeId: number;
}
