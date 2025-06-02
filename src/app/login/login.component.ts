import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/authentication/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  loggedIn = false;

  private authSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSub = this.authService.user$.subscribe((isLoggedIn) => {
      this.loggedIn = isLoggedIn;
    });
  }

  login() {
    const user: User = {
      email: this.email,
      password: this.password,
    };
    this.authService.loginUser(user).then((result) => {
      if (result == null) {
        console.log('Logged in successfully, navigating to dashboard...');
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Login error:', result);
        this.errorMessage = result.message;
      }
    });
  }
}
