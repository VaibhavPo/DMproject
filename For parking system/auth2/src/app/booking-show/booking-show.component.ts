import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-show',
  templateUrl: './booking-show.component.html',
  styleUrls: ['./booking-show.component.css']
})
export class BookingsComponent implements OnInit {

  bookings: any[] = [];
  qrCode: string = '';
  username;
  token; // Replace with the actual token
  requestUrl ='http://localhost:5000/'


  constructor(private http: HttpClient, private router: Router) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { token: string ,username: string};
    this.token = state?.token || '';
    this.username = state?.username || '';
    
  }

  ngOnInit(): void {
    const headers = new HttpHeaders().set('Authorization', this.token);
    this.http.post<any[]>(`${this.requestUrl}bookings`, {username:this.username},{ headers })
      .subscribe(data => {
        this.bookings = data;
      }, error => {
        console.error('Error fetching bookings', error);
      });
  }

  generateQR(by_id: string): void {
    const headers = new HttpHeaders().set('Authorization', this.token);
    this.http.get<any>(`${this.requestUrl}generate-qr?by_id=${by_id}`, { headers })
      .subscribe(data => {
         this.qrCode = data.qrCode;
         this.username;
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<img src="${this.qrCode}" alt="QR Code">`);
        } else {
          console.error('Failed to open new window');
        }
        // this.qrCode = response.qrCode;
      }, error => {
        console.error('Error generating QR code', error);
      });
  }
}