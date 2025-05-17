import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { client } from '../models/client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  public getClientByDocument(document: string): Observable<client> {
      return this.http.get<client>(`${environment.bookingapi}/Client/GetClientByDocument/${document}`);
    }
}
