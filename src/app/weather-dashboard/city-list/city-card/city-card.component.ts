import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { City } from '../../../shared/models/city.model';

@Component({
  selector: 'app-city-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.scss'],
})
export class CityCardComponent {
  @Input() city!: City;
  @Output() delete = new EventEmitter<City>();
  @Output() setCurrent = new EventEmitter<City>();
  @Output() toggleFavorite = new EventEmitter<City>();

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.city);
  }

  onToggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    this.toggleFavorite.emit(this.city);
  }
}
