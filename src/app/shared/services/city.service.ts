import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from './authentication/auth.service';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly STORAGE_KEY_BASE = 'weather_app_cities';
  private STORAGE_KEY = `${this.STORAGE_KEY_BASE}_guest`;

  private citiesSubject = new BehaviorSubject<City[]>([]);
  readonly cities$ = this.citiesSubject.asObservable();
  readonly favoriteCities$ = this.citiesSubject
    .asObservable()
    .pipe(map((cities) => cities.filter((c) => c.isFavorite)));

  private currentCitySubject = new BehaviorSubject<City | null>(null);
  readonly currentCity$ = this.currentCitySubject.asObservable();

  constructor(private authService: AuthService) {
    this.authService.firebaseUser$.subscribe((user) => {
      this.STORAGE_KEY = `${this.STORAGE_KEY_BASE}_${user ? user.email : 'guest'}`;
      this.loadFromStorage();
    });
    this.loadFromStorage();
  }

  addCity(city: City): void {
    const cities = this.citiesSubject.getValue();

    const alreadyExists = cities.some(
      (c) => c.name === city.name && c.lat === city.lat && c.lon === city.lon
    );
    if (alreadyExists) {
      this.setCurrentCity(city);
      return;
    }

    const updated = [
      ...cities,
      { ...city, isCurrent: false, isFavorite: city.isFavorite ?? false },
    ];
    this.citiesSubject.next(updated);
    this.saveToStorage();

    this.setCurrentCity(city);
  }

  removeCity(city: City): void {
    const filtered = this.citiesSubject
      .getValue()
      .filter(
        (c) =>
          !(c.name === city.name && c.lat === city.lat && c.lon === city.lon)
      );
    this.citiesSubject.next(filtered);
    this.saveToStorage();

    const current = this.currentCitySubject.getValue();
    if (
      current &&
      current.name === city.name &&
      current.lat === city.lat &&
      current.lon === city.lon
    ) {
      const next = filtered.length ? filtered[0] : null;
      this.currentCitySubject.next(next);
      this.updateCurrentFlag(next);
    }

    if (filtered.length === 0) {
      this.currentCitySubject.next(null);
    }
  }

  setCurrentCity(city: City): void {
    this.currentCitySubject.next(city);
    this.updateCurrentFlag(city);
  }

   toggleFavorite(city: City): void {
    const updated = this.citiesSubject.getValue().map((c) =>
      c.name === city.name && c.lat === city.lat && c.lon === city.lon
        ? { ...c, isFavorite: !c.isFavorite }
        : c
    );
    this.citiesSubject.next(updated);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const cities: City[] = stored ? JSON.parse(stored) : [];
    this.citiesSubject.next(cities);
    const current = cities.find((c) => c.isCurrent) || null;
    this.currentCitySubject.next(current);
  }

  private updateCurrentFlag(selected: City | null): void {
    const updated = this.citiesSubject.getValue().map((c) => ({
      ...c,
      isCurrent: selected
        ? c.name === selected.name &&
          c.lat === selected.lat &&
          c.lon === selected.lon
        : false,
    }));
    this.citiesSubject.next(updated);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.citiesSubject.getValue())
    );
  }
}
