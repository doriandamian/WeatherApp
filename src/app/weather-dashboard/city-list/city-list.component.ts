import { Component } from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/services/city.service';
import { Observable } from 'rxjs';
import { City } from '../../shared/models/city.model';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CityCardComponent, CommonModule, CarouselModule, FormsModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
})
export class CityListComponent {
  cities$!: Observable<City[]>;
  showFavoritesOnly = false;

  constructor(public cityService: CityService) {
    this.onFilterChange();
  }

  onFilterChange() {
    this.cities$ = this.showFavoritesOnly
      ? this.cityService.favoriteCities$
      : this.cityService.cities$;
  }

  onDelete(city: City) {
    this.cityService.removeCity(city);
  }

  onSetCurrent(city: City) {
    this.cityService.setCurrentCity(city);
  }

  onToggleFavorite(city: City) {
    this.cityService.toggleFavorite(city);
  }

  getNumVisible(length: number): number {
    return Math.min(length, 5);
  }
}
