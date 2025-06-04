import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/authentication/auth.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TempUnit, WeatherService } from '../shared/services/weather.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    RadioButtonModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  displaySettings = false;
  selectedUnit: TempUnit = 'C';

  constructor(
    private authService: AuthService,
    private weatherService: WeatherService,
    private router: Router
  ) {
    this.weatherService.unit$.subscribe((u) => (this.selectedUnit = u));
  }

  ngOnInit(): void {}

  logout() {
    this.authService
      .logoutUser()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }

  openSettings() {
    this.displaySettings = true;
  }

  saveSettings() {
    this.weatherService.setUnit(this.selectedUnit);
    this.displaySettings = false;
  }
}
