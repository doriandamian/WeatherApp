import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { WeatherData } from '../../../shared/models/weather.model';
import {
  TempUnit,
  WeatherService,
} from '../../../shared/services/weather.service';

@Component({
  selector: 'app-highlight-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './highlight-card.component.html',
  styleUrl: './highlight-card.component.scss',
})
export class HighlightCardComponent {
  @Input() type!: keyof WeatherData;
  @Input() data?: WeatherData;
  unit: TempUnit = 'C';

  constructor(private weatherService: WeatherService) {
    this.weatherService.unit$.subscribe((u) => (this.unit = u));
  }

  get label(): string {
    switch (this.type) {
      case 'temperature':
        return 'Temperature';
      case 'precipitation':
        return 'Precipitation';
      case 'precipitationProbability':
        return 'Precip. Prob.';
      case 'visibility':
        return 'Visibility';
      case 'uvIndex':
        return 'UV Index';
      case 'apparentTemperature':
        return 'Apparent Temp.';
      default:
        return '';
    }
  }

  get value(): string {
    if (!this.data) {
      return '';
    }
    const v = this.data[this.type];
    switch (this.type) {
      case 'temperature':
        return this.unit === 'C'
          ? `${(v as number).toFixed(1)} °C`
          : `${(((v as number) * 9) / 5 + 32).toFixed(1)} °F`;
      case 'precipitation':
        return v as string;
      case 'precipitationProbability':
        return `${v as number} %`;
      case 'visibility':
        return `${v as number} km`;
      case 'uvIndex':
        return `${v as number}`;
      case 'apparentTemperature':
        return this.unit === 'C'
          ? `${(v as number).toFixed(1)} °C`
          : `${(((v as number) * 9) / 5 + 32).toFixed(1)} °F`;
      default:
        return `${v}`;
    }
  }
}
