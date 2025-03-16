import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit, OnDestroy {
  private html5QrCodeScanner: Html5QrcodeScanner | undefined;
  scanSuccessMessage: string | null = null;
  charge: number | null = null;
  showPaymentButtons = false;
  byId: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient // Inject HttpClient
  ) { }

  ngOnInit(): void {
    // QR code scanner initialization code here
    if (isPlatformBrowser(this.platformId)) {
      this.html5QrCodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 3, qrbox: 250 }, true);
      this.html5QrCodeScanner.render(this.onScanSuccess.bind(this), this.onScanError.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.html5QrCodeScanner) {
      this.html5QrCodeScanner.clear().catch((error) => {
        console.error("Failed to clear QR Code scanner:", error);
      });
    }
  }

  onScanSuccess(decodedText: string) {
    this.scanSuccessMessage = `Code matched = ${decodedText}`;
    console.log(`Code matched = ${decodedText}`);
    

    const regex = /ID:(.+)$/;
    const match = decodedText.match(regex);
    if (match) {
      this.byId = match[1].trim();
      this.checkEntry(this.byId);
    }

    setTimeout(() => this.scanSuccessMessage = null, 3000);
  }
  onScanError(errorMessage: string) {
    // console.error(`QR Code scan error: ${errorMessage}`);
  }
  checkEntry(by_id: string) {
    const url = 'http://localhost:4000/check-entry';  // Replace with your server URL
    const body = { by_id: by_id };
    this.http.post(url, body).subscribe(
      (response: any) => {
        console.log('Check entry response', response);
        if (response.charge) {
          // Display charge and show buttons
          this.charge = response.charge;
          this.showPaymentButtons = true;
        }
        else{
          alert('The vehcile has marked entered.')
        }
      },
      error => {
        console.error('Check entry error', error);
      }
    );
  }

  payCharge() {
    alert('Are you sure that you have paid the amount?')
    if (this.byId) {
      const url = 'http://localhost:4000/pay-charge';  // Replace with your server URL
      const body = { by_id: this.byId };
      this.http.post(url, body).subscribe(
        response => {
          console.log('Payment successful', response);
          this.showPaymentButtons = false;
          this.charge = null;
        },
        error => {
          console.error('Payment error', error);
        }
      );
    }
    alert('Slot Exited Success')
  }

  cancelPayment() {
    this.showPaymentButtons = false;
    this.charge = null;
  }
}
