import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/authentication/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signup() {
    const user = {
      email: this.email,
      password: this.password,
    };

    this.authService.signupUser(user).then((result) => {
      if (result == null) {
        console.log('Signed up successfully, navigating to dashboard...');
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Signup error:', result);
        this.errorMessage = result.message;
      }
    });
  }
}
