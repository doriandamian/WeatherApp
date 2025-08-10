import { Component, ViewChild, ElementRef } from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/services/city.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  carouselKey = 0;
  @ViewChild('scrollRow', { static: false }) scrollRow!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    if (this.scrollRow && this.scrollRow.nativeElement) {
      this.scrollRow.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.scrollRow && this.scrollRow.nativeElement) {
      this.scrollRow.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  constructor(public cityService: CityService) {
    this.onFilterChange();
  }

  onFilterChange() {
    this.cities$ = (this.showFavoritesOnly
      ? this.cityService.favoriteCities$
      : this.cityService.cities$).pipe(
        tap((cities: City[]) => { this.carouselKey = cities.length ? cities.map((c: City) => c.name).join('-').hashCode() : 0; })
      );
  }

  onDelete(city: City) {
    this.cityService.removeCity(city);
    this.carouselKey++;
  }

  onSetCurrent(city: City) {
    this.cityService.setCurrentCity(city);
  }

  onToggleFavorite(city: City) {
    this.cityService.toggleFavorite(city);
    this.carouselKey++;
  }

  getNumVisible(length: number): number {
    return Math.min(length, 5);
  }
}

declare global {
  interface String {
    hashCode(): number;
  }
}
if (!String.prototype.hashCode) {
  String.prototype.hashCode = function(): number {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
}
