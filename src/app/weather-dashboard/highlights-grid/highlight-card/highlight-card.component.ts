import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-highlight-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './highlight-card.component.html',
  styleUrl: './highlight-card.component.scss'
})
export class HighlightCardComponent {
  @Input() type!: 'temperature' | 'precipitation' | 'precipProb' | 'visibility' | 'uvIndex' | 'apparentTemp';
  @Input() data: any; 
}
