import { Component } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-book-qr',
  templateUrl: './book-qr.component.html',
  styleUrls: ['./book-qr.component.css']
})
export class BookQRComponent {
  username: string = '';
  carNumber: string = '';
  slot: any = '';
  token: string = '';
  qrCode: string = '';
  entries: any[] = [];

  constructor(private bookingService: BookingService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { token: string ,username: string};
    this.token = state?.token || '';
    this.username = state?.username || '';
  }

  ngOnInit(): void {
    this.bookingService.getEntries("01").subscribe(
      data => {
        console.log('Entries fetched:', data); // <-- ✅ Print the data here
        this.entries = data;
      },
     
      error => console.error('Error fetching entries', error)
    );
    
  }

  bookSlot() {
    this.ngOnInit()
    // console.log(this.username, this.carNumber, this.slot, this.token)
    this.bookingService.bookSlot(this.username, this.carNumber, this.slot, this.token).subscribe(
      response => {
        alert('QR Generated successfully.');
        this.slot=''
        this.qrCode = response.qrCode;
        
      },
      error => {
        console.error('Booking failed', error);
        alert('Booking failed: ' + error.error.error);
      }
    );
  }
  history(){
    console.log('clicked')
    this.router.navigate(['/bookings'], { state: { token: this.token, username: this.username } });
  }

}
