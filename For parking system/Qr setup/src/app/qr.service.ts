import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  private apiUrl = 'http://localhost:3000'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  checkEntry(by_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-entry`, { by_id });
  }
}
