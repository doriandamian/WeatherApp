import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
 
private baseUrl = 'https://api.open-meteo.com/v1/forecast';
 
  constructor(private http: HttpClient) { }
 
  getWeather(latitude: number, longitude: number): Observable<any> {
    const params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,wind_speed_10m,precipitation,cloud_cover,apparent_temperature,weather_code', 
      hourly: 'temperature_2m,wind_speed_10m', 
      timezone: 'auto'
    };
 
    return this.http.get(this.baseUrl, { params });
  }
}