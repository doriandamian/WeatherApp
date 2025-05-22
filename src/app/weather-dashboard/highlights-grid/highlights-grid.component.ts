import { Component, Input } from '@angular/core';
import { HighlightCardComponent } from './highlight-card/highlight-card.component';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../shared/models/weather.model';

@Component({
  selector: 'app-highlights-grid',
  standalone: true,
  imports: [HighlightCardComponent, CommonModule],
  templateUrl: './highlights-grid.component.html',
  styleUrl: './highlights-grid.component.scss',
})
export class HighlightsGridComponent {
  @Input() data!: WeatherData;

  types: Array<keyof WeatherData> = [
    'temperature',
    'precipitation',
    'precipitationProbability',
    'visibility',
    'uvIndex',
    'apparentTemperature',
  ];
}
