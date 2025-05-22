import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CityListComponent } from './city-list/city-list.component';
import { HighlightsGridComponent } from './highlights-grid/highlights-grid.component';
import { WeatherGraphComponent } from './highlights-grid/weather-graph/weather-graph.component';
import { CommonModule } from '@angular/common';
import { CityService } from '../shared/services/city.service';
import { WeatherService } from '../shared/services/weather.service';
import { filter, Observable, switchMap } from 'rxjs';
import { WeatherData } from '../shared/models/weather.model';
import { City } from '../shared/models/city.model';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss'],
  imports: [
    SearchBarComponent,
    CityListComponent,
    HighlightsGridComponent,
    WeatherGraphComponent,
    CommonModule,
    CardModule,
  ],
})
export class WeatherDashboardComponent {
  currentWeather$!: Observable<WeatherData>;

  constructor(
    public cityService: CityService,
    public weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.currentWeather$ = this.cityService.currentCity$.pipe(
      filter((city): city is City => city !== null),
      switchMap((city) => this.weatherService.getCurrentWeather(city))
    );
  }
}
