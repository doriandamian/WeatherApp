import { Component } from '@angular/core';
import { CityCardComponent } from "./city-card/city-card.component";
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/services/city.service';
import { Observable } from 'rxjs';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CityCardComponent, CommonModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss'
})
export class CityListComponent {
  cities$!: Observable<City[]>;

  constructor(public cityService: CityService) {
    this.cities$ = this.cityService.cities$;
  }
}
