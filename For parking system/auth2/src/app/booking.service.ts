import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getEntries(ParkNo:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/parking_space/slots?for=${ParkNo}`);
  }

  bookSlot(username: string, car_number: string, slot_number: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/book-slot`, { username, car_number, slot_number, id:`01` }, { headers });
  
  }
  
}
