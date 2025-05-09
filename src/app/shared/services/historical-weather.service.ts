import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

const url = "https://archive-api.open-meteo.com/v1/archive";

@Injectable({
  providedIn: 'root'
})
export class HistoricalWeatherService {

  constructor(private http: HttpClient) { }

  getHistoricalWeather(latitude: number = 44.439663, longitude: number = 26.096306){

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const params = {
      "latitude": latitude.toString(),
      "longitude": longitude.toString(),
      "start_date": sevenDaysAgo,
      "end_date": yesterday,
      "hourly": "temperature_2m"
    }

    return this.http.get(url, {params});
  }
}
