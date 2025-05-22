import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly STORAGE_KEY = 'weather_app_cities';

  private citiesSubject = new BehaviorSubject<City[]>([]);
  readonly cities$ = this.citiesSubject.asObservable();

  private currentCitySubject = new BehaviorSubject<City | null>(null);
  readonly currentCity$ = this.currentCitySubject.asObservable();

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const cities: City[] = stored ? JSON.parse(stored) : [];

    this.citiesSubject = new BehaviorSubject<City[]>(cities);
    this.cities$ = this.citiesSubject.asObservable();

    const current = cities.find((c) => c.isCurrent) || null;
    this.currentCitySubject = new BehaviorSubject<City | null>(current);
    this.currentCity$ = this.currentCitySubject.asObservable();
  }

  addCity(city: City): void {
    const cities = this.citiesSubject.getValue();
    if (cities.find((c) => c.name === city.name)) {
      return;
    }

    const updated = [...cities, { ...city, isCurrent: false }];
    this.citiesSubject.next(updated);
    this.saveToStorage();

    this.citiesSubject.next([...cities, { ...city, isCurrent: false }]);
    if (!this.currentCitySubject.getValue()) {
      this.setCurrentCity(city);
    }
  }

  removeCity(city: City): void {
    const filtered = this.citiesSubject
      .getValue()
      .filter((c) => c.name !== city.name);
    this.citiesSubject.next(filtered);
    this.saveToStorage();

    const current = this.currentCitySubject.getValue();
    if (current?.name === city.name) {
      const next = filtered.length ? filtered[0] : null;
      this.currentCitySubject.next(next);
      this.updateCurrentFlag(next);
    }
  }

  setCurrentCity(city: City): void {
    this.currentCitySubject.next(city);
    this.updateCurrentFlag(city);
  }

  private updateCurrentFlag(selected: City | null): void {
    const updated = this.citiesSubject.getValue().map((c) => ({
      ...c,
      isCurrent: selected ? c.name === selected.name : false,
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
