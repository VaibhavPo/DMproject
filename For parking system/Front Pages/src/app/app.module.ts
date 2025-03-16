import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { AppComponent } from './app.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

@NgModule({
  declarations: [
    AppComponent,
    QrScannerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ZXingScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
