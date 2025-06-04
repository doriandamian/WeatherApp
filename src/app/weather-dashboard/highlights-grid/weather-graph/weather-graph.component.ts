import { Component } from '@angular/core';
import {
  TempUnit,
  WeatherService,
} from '../../../shared/services/weather.service';
import { HistoricalData } from '../../../shared/models/weather.model';
import { filter, Subscription, switchMap } from 'rxjs';
import { CityService } from '../../../shared/services/city.service';
import { City } from '../../../shared/models/city.model';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-weather-graph',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './weather-graph.component.html',
  styleUrl: './weather-graph.component.scss',
})
export class WeatherGraphComponent {
  private historicDataSub!: Subscription;
  unit: TempUnit = 'C';
  data: HistoricalData[] = [];

  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        tension: 0.3,
      },
    ],
  };

  chartOptions: ChartOptions<'line'> = {};

  constructor(
    private weatherService: WeatherService,
    private cityService: CityService
  ) {
    this.weatherService.unit$.subscribe((u) => {
      this.unit = u;
      this.chartOptions = this.makeOptions(u);
      this.updateChart(this.data);
    });
  }

  ngOnInit(): void {
    this.historicDataSub = this.cityService.currentCity$
      .pipe(
        filter((city): city is City => city != null),
        switchMap((city) => this.weatherService.getHistoricalWeather(city))
      )
      .subscribe((data) => {
        this.updateChart(data);
        this.data = data;
      });
  }

  ngOnDestroy(): void {
    this.historicDataSub?.unsubscribe();
  }

  private updateChart(data: HistoricalData[]) {
    const today = new Date().toISOString().split('T')[0];

    const filteredData = data.filter((d) => {
      const dateOnly = d.date.split('T')[0];
      return dateOnly !== today;
    });

    const validData = filteredData.filter(
      (d) => d.temp !== null && d.temp !== undefined
    );

    const labels = validData.map((d) => {
      const date = new Date(d.date);
      const hours = date.getHours();
      const minutes = date.getMinutes();

      if (hours === 0 && minutes === 0) {
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
      } else {
        return '';
      }
    });

    const temperatures = validData.map((d) => d.temp);
    if (this.unit === 'F') {
      temperatures.forEach((temp, index) => {
        temperatures[index] = (temp * 9) / 5 + 32;
      });
    }

    this.chartData = {
      labels,
      datasets: [
        {
          data: temperatures,
          borderColor: 'rgba(53, 174, 249, 0.7)',
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  }

  private makeOptions(unit: TempUnit): ChartOptions<'line'> {
    const minC = -20;
    const maxC = 50;
    const stepC = 10;

    const toF = (c: number) => (c * 9) / 5 + 32;
    const toStepF = (cStep: number) => toF(minC + cStep) - toF(minC);

    const min = unit === 'C' ? minC : toF(minC);
    const max = unit === 'C' ? maxC : toF(maxC);
    const step = unit === 'C' ? stepC : toStepF(stepC);

    return {
      responsive: true,
      scales: {
        y: {
          min,
          max,
          ticks: {
            stepSize: step,
            callback: (value) => (unit === 'C' ? `${value}°C` : `${value}°F`),
          },
          title: {
            display: true,
            text: unit === 'C' ? 'Temperature (°C)' : 'Temperature (°F)',
          },
          border: { display: false },
        },
        x: {
          title: { display: true },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
      },
    };
  }
}
