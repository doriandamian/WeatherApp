import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  query: string = '';
  @Output() citySelected = new EventEmitter<City>();

  onSearch(): void {
    if (!this.query.trim()) return;
    // aici ar trebui să transformi query într-un City (cu lat/lon)
    const city: City = { name: this.query.trim(), lat: 44.4268, lon: 26.1025, isCurrent: false };
    this.citySelected.emit(city);
    this.query = '';
  }
}
