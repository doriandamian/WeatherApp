import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card'; 
import { PanelModule } from 'primeng/panel';
 
 
@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, PanelModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss'],
})
export class WeatherDashboardComponent implements OnInit {
 
  weatherData: any;
  latitude: number = 46.7712;   
  longitude: number = 23.5922;  
  loading: boolean = true;
  errorMessage: string | null = null;
  searchTerm: string = ''; 
 
  constructor(private weatherService: WeatherService) { }
 
  ngOnInit(): void {
    this.getWeatherData();
  }
 
  getWeatherData(): void {
    this.loading = true; 
    this.weatherService.getWeather(this.latitude, this.longitude).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
        this.loading = false; 
      }
    });
  }
}