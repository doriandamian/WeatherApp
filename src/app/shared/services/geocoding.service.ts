// src/app/core/services/geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { City } from '../models/city.model';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private url = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private http: HttpClient) {}

  searchCities(name: string): Observable<City[]> {
    if (name.length < 2) {
      return of([]);
    }
    const params = new HttpParams()
      .set('name', name)
      .set('count', '10');
    return this.http.get<any>(this.url, { params }).pipe(
      map(res =>
        (res.results || []).map((r: any) => ({
          name: `${r.name}, ${r.country}`,
          lat: r.latitude,
          lon: r.longitude,
          isCurrent: false
        }))
      ),
      catchError(() => of([]))
    );
  }
}
