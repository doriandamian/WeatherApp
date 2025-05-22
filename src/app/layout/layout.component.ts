import { Component } from '@angular/core';
import { WeatherDashboardComponent } from '../weather-dashboard/weather-dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [WeatherDashboardComponent, SidebarComponent, CommonModule],
})
export class LayoutComponent {}
