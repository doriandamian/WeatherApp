// src/app/core/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { City } from '../models/city.model';
import { WeatherData, HistoricalData } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';
  private archiveUrl  = 'https://archive-api.open-meteo.com/v1/archive';

  constructor(private http: HttpClient) {}

  /**
   * Date meteo curente:
   * - temperature_2m
   * - precipitation_probability
   * - uv_index
   * - visibility
   */
  getCurrentWeather(city: City): Observable<WeatherData> {
    const params = new HttpParams()
      .set('latitude',  city.lat.toString())
      .set('longitude', city.lon.toString())
      .set('current_weather', 'true')
      .set('hourly', 'temperature_2m,precipitation_probability,uv_index,visibility')
      .set('timezone', 'auto');

    return this.http
      .get<{ current_weather: any }>(this.forecastUrl, { params })
      .pipe(
        map(res => this.toWeatherData(res.current_weather)),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  /**
   * Date istorice (archive):
   * - daily temperature max/min
   * startDate/endDate în format YYYY-MM-DD
   */
  getHistoricalWeather(
    city: City,
    startDate: string,
    endDate: string
  ): Observable<HistoricalData[]> {
    const params = new HttpParams()
      .set('latitude',  city.lat.toString())
      .set('longitude', city.lon.toString())
      .set('start_date', startDate)
      .set('end_date',   endDate)
      .set('daily',      'temperature_2m_max,temperature_2m_min')
      .set('timezone',   'auto');

    return this.http
      .get<any>(this.archiveUrl, { params })
      .pipe(
        map(res => this.toHistoricalData(res.daily))
      );
  }

  private toWeatherData(raw: any): WeatherData {
    return {
      temperature: raw.temperature,
      windSpeed:   raw.windspeed,
      uvIndex:     raw.uv_index,
      visibility:  raw.visibility,
      precipitationProbability: raw.precipitation_probability,
      time:        raw.time
    };
  }

  private toHistoricalData(rawDaily: any): HistoricalData[] {
    return rawDaily.time.map((date: string, i: number) => ({
      date,
      tempMax: rawDaily.temperature_2m_max[i],
      tempMin: rawDaily.temperature_2m_min[i]
    }));
  }
}
