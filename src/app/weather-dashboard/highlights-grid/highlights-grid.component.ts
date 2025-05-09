import { Component, Input } from '@angular/core';
import { HighlightCardComponent } from "./highlight-card/highlight-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highlights-grid',
  standalone: true,
  imports: [HighlightCardComponent, CommonModule],
  templateUrl: './highlights-grid.component.html',
  styleUrl: './highlights-grid.component.scss'
})
export class HighlightsGridComponent {
  @Input() data: any;
}
