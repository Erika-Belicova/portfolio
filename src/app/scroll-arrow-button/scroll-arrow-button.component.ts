import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-arrow-button',
  standalone: true,
  imports: [],
  templateUrl: './scroll-arrow-button.component.html',
  styleUrl: './scroll-arrow-button.component.css'
})
export class ScrollArrowButtonComponent {
  @Output() click = new EventEmitter<void>();
}
