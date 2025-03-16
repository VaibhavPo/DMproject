import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
    
  };
  token: string = '';
  resetData = {
    dob: '',
    mobile: ''
  };

  resetPasswordVisible = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.loginData).subscribe(
      response => {
        this.token = response.token;
        console.log('Login successful', response);
        alert('Login Success')

              // Navigate to book-slot component
      this.router.navigate(['/book-slot'], { state: { token: this.token, username: this.loginData.username } });
      },
      error => {
        console.error('Login error', error);
      }
    );
  }

  showResetPassword() {
    if (this.resetPasswordVisible){
      this.resetPasswordVisible = false;
    }
    else{
      this.resetPasswordVisible = true;
    }
    
  }

  onResetPassword() {
    this.authService.resetPassword(this.resetData).subscribe(
      response => {
        console.log('Password reset successful', response);
        alert(`Password reset successfully. Your new password is: ${response.newPassword}`);

      },
      error => {
        console.error('Password reset error', error);
      }
    );
  }
}
