import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface UnsplashResponse { results: Array<{ urls: { small: string } }> }

@Injectable({ providedIn: 'root' })
export class ImageService {
  private apiUrl = 'https://api.unsplash.com/search/photos';
  private accessKey = 'NAD3cmOZ277kE6epEaggSX_du_28Tm01cZtOemRNZew';

  constructor(private http: HttpClient) {}

  getCityImage(cityName: string): Observable<string> {
    const params = new HttpParams()
      .set('query', cityName)
      .set('per_page', '1')
      .set('client_id', this.accessKey);

    return this.http.get<UnsplashResponse>(this.apiUrl, { params }).pipe(
      map(res => res.results[0]?.urls.small || '')
    );
  }
}