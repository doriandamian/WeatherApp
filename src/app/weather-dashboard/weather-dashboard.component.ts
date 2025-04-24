import { Component } from '@angular/core';
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { CityListComponent } from "./city-list/city-list.component";
import { HighlightsGridComponent } from "./highlights-grid/highlights-grid.component";
import { WeatherGraphComponent } from "./highlights-grid/weather-graph/weather-graph.component";
import { CommonModule } from '@angular/common';
import { CityService } from '../shared/services/city.service';
import { WeatherService } from '../shared/services/weather.service';
 
@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  templateUrl: './weather-dashboard.component.html', 
  styleUrls: ['./weather-dashboard.component.scss'],
  imports: [SearchBarComponent, CityListComponent, HighlightsGridComponent, WeatherGraphComponent, CommonModule]    
})
export class WeatherDashboardComponent {
  constructor(
    public cityService: CityService,
    public weatherService: WeatherService
  ) {}
}