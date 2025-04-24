// src/app/core/services/city.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citiesSubject = new BehaviorSubject<City[]>([]);
  readonly cities$ = this.citiesSubject.asObservable();

  private currentCitySubject = new BehaviorSubject<City | null>(null);
  readonly currentCity$ = this.currentCitySubject.asObservable();

  /** Adaugă un oraș dacă nu există deja și, dacă e primul, îl setează current */
  addCity(city: City): void {
    const cities = this.citiesSubject.getValue();
    if (cities.find(c => c.name === city.name)) {
      return;
    }
    this.citiesSubject.next([...cities, { ...city, isCurrent: false }]);
    if (!this.currentCitySubject.getValue()) {
      this.setCurrentCity(city);
    }
  }

  /** Șterge un oraș; dacă era current, alege următorul sau null */
  removeCity(city: City): void {
    const filtered = this.citiesSubject.getValue().filter(c => c.name !== city.name);
    this.citiesSubject.next(filtered);

    const current = this.currentCitySubject.getValue();
    if (current?.name === city.name) {
      const next = filtered.length ? filtered[0] : null;
      this.currentCitySubject.next(next);
      this.updateCurrentFlag(next);
    }
  }

  /** Marchează un oraș existent ca fiind current */
  setCurrentCity(city: City): void {
    this.currentCitySubject.next(city);
    this.updateCurrentFlag(city);
  }

  /** Intern: actualizează câmpul isCurrent în lista de orașe */
  private updateCurrentFlag(selected: City | null): void {
    const updated = this.citiesSubject.getValue().map(c => ({
      ...c,
      isCurrent: selected ? c.name === selected.name : false
    }));
    this.citiesSubject.next(updated);
  }
}
