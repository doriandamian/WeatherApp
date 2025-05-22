// src/app/core/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { City } from '../models/city.model';
import { WeatherData, HistoricalData } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';
  private archiveUrl = 'https://archive-api.open-meteo.com/v1/archive';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: City): Observable<WeatherData> {
    const params = new HttpParams()
      .set('latitude', city.lat.toString())
      .set('longitude', city.lon.toString())
      .set('current_weather', 'true')
      .set(
        'hourly',
        'temperature_2m,precipitation,precipitation_probability,uv_index,visibility,apparent_temperature'
      )
      .set('timezone', 'auto');

    return this.http
      .get<{ current_weather: any; hourly: any }>(this.forecastUrl, { params })
      .pipe(
        map((res) => this.toWeatherData(res.current_weather, res.hourly)),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  getHistoricalWeather(city: City): Observable<HistoricalData[]> {
    const params = new HttpParams()
      .set('latitude', city.lat.toString())
      .set('longitude', city.lon.toString())
      .set('past_days', 8)
      .set('hourly', 'temperature_2m')
      .set('timezone', 'auto');

    return this.http
      .get<any>(this.archiveUrl, { params })
      .pipe(map((res) => this.toHistoricalData(res.hourly)));
  }

  private toWeatherData(current: any, hourly: any): WeatherData {
    const [datePart, timePart] = current.time.split('T');
    const hour = timePart.split(':')[0];
    const flooredTime = `${datePart}T${hour}:00`;
    const idx = hourly.time.indexOf(flooredTime);
    return {
      temperature: current.temperature,
      uvIndex: idx >= 0 ? hourly.uv_index[idx].toFixed(1) : 'N/A',
      visibility: idx >= 0 ? (hourly.visibility[idx] / 1000).toFixed(1) : 'N/A',
      precipitationProbability:
        idx >= 0 ? hourly.precipitation_probability[idx].toFixed(1) : 'N/A',
      precipitation:
        idx >= 0 ? `${hourly.precipitation[idx].toFixed(1)} mm` : 'N/A',
      apparentTemperature:
        idx >= 0 ? hourly.apparent_temperature[idx] : current.temperature,
    };
  }

  private toHistoricalData(rawDaily: any): HistoricalData[] {
    return rawDaily.time.map((date: string, i: number) => ({
      date,
      temp: rawDaily.temperature_2m[i],
    }));
  }
}
