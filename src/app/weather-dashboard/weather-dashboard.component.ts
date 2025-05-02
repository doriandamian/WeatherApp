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
  latitude: number = 52.52;   
  longitude: number = 13.41;  
  loading: boolean = true; 
 
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