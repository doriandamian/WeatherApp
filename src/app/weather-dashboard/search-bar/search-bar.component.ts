import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City } from '../../shared/models/city.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { GeocodingService } from '../../shared/services/geocoding.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  query: string = '';
  filteredCities: City[] = [];
  @Output() citySelected = new EventEmitter<City>();

  constructor(private geoService: GeocodingService) {}

  searchCities(event: { query: string }) {
    this.geoService.searchCities(event.query)
      .subscribe(list => this.filteredCities = list);
  }

  onSelect(city: City) {
    this.emitAndClear(city);
  }

  addCityFromQuery() {
    const name = this.query.trim();
    if (!name) {
      return;
    }
    // dacă nu vrei geocoding, pui coordonate fixe sau ți le calculezi altfel
    const city: City = { name, lat: 44.4268, lon: 26.1025, isCurrent: false };
    this.emitAndClear(city);
  }

  private emitAndClear(city: City) {
    this.citySelected.emit(city);
    this.query = '';
    this.filteredCities = [];
  }
}
