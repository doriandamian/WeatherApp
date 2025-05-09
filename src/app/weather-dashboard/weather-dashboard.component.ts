import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { CityListComponent } from "./city-list/city-list.component";
import { HighlightsGridComponent } from "./highlights-grid/highlights-grid.component";
import { WeatherGraphComponent } from "./highlights-grid/weather-graph/weather-graph.component";
import { CommonModule } from '@angular/common';
import { CityService } from '../shared/services/city.service';
import { WeatherService } from '../shared/services/weather.service';
import { CardModule } from 'primeng/card'; 
import { PanelModule } from 'primeng/panel';

 
@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  templateUrl: './weather-dashboard.component.html', 
  styleUrls: ['./weather-dashboard.component.scss'],
  imports: [SearchBarComponent, CityListComponent, HighlightsGridComponent, WeatherGraphComponent, CommonModule, CardModule, PanelModule]    
})
export class WeatherDashboardComponent {
  weatherData: any;
  latitude: number = 44.439663;   
  longitude: number = 26.096306;  
  loading: boolean = true;
  errorMessage: string | null = null;
  searchTerm: string = ''; 
  
  constructor(
    public cityService: CityService,
    public weatherService: WeatherService
  ) {}
  
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