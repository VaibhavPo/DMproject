import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData = {
    name: '',
    dob: '',
    username: '',
    password: '',
    mobile: ''
  };

  constructor(private authService: AuthService) {}

  onSignup() {
    this.authService.signup(this.signupData).subscribe(
      response => {
        console.log('Signup successful', response);
      },
      error => {
        console.error('Signup error', error);
      }
    );
  }
}
