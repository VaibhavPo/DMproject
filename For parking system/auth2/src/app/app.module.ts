import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { BookQRComponent } from './book-qr/book-qr.component';
import { SlotNoDropDownComponent } from './slot-no-drop-down/slot-no-drop-down.component';
import { BookingsComponent } from './booking-show/booking-show.component';
// import { QRshowComponent } from './qrshow/qrshow.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    BookQRComponent,
    SlotNoDropDownComponent,
    BookingsComponent,
    // QRshowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
