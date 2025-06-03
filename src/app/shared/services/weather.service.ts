// src/app/core/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { City } from '../models/city.model';
import { WeatherData, HistoricalData } from '../models/weather.model';

export type TempUnit = 'C' | 'F';
const STORAGE_KEY = 'weather_app_unit';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';
  private archiveUrl = 'https://archive-api.open-meteo.com/v1/archive';
  private unitSubject = new BehaviorSubject<TempUnit>(
    (localStorage.getItem(STORAGE_KEY) as TempUnit) || 'C'
  );
  unit$ = this.unitSubject.asObservable();

  

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
      .get<{
        current_weather: {
          time: string;
          temperature: number;
        };
        hourly: {
          time: string[];
          temperature_2m: number[];
          precipitation: number[];
          precipitation_probability: number[];
          uv_index: number[];
          visibility: number[];
          apparent_temperature: number[];
        };
      }>(this.forecastUrl, { params })
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
      .get<{ hourly: { time: string[]; temperature_2m: number[] } }>(
        this.archiveUrl,
        { params }
      )
      .pipe(map((res) => this.toHistoricalData(res.hourly)));
  }

  setUnit(u: TempUnit) {
    localStorage.setItem(STORAGE_KEY, u);
    this.unitSubject.next(u);
  }
  private toWeatherData(
    current: {
      time: string;
      temperature: number;
    },
    hourly: any
  ): WeatherData {
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

  private toHistoricalData(rawHourly: {
    time: string[];
    temperature_2m: number[];
  }): HistoricalData[] {
    return rawHourly.time.map((date: string, i: number) => ({
      date,
      temp: rawHourly.temperature_2m[i],
    }));
  }
}
