import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @Input() offsetTop = 0; // navbar height

  ngOnChanges(changes: SimpleChanges) {
    if (changes['offsetTop']) {
      console.log('offsetTop changed:', this.offsetTop);
    }
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  scrollToSection(id: string, event: Event) {
    event.preventDefault(); // stop href="#" from scrolling to top

    const el = document.getElementById(id);
    if (el) {
      let yOffset = -40; // about 1cm offset above card -> alternative: -window.innerHeight * 0.05 (for 5%)

      // detect if on mobile screen
      const isMobilePortrait = window.matchMedia('(max-height: 529px) and (max-width: 530px) and (orientation: portrait)').matches;
      const isMobileLandscape = window.matchMedia('(max-height: 529px) and (min-width: 530px) and (orientation: landscape)').matches;

      if (isMobilePortrait) {
        yOffset = 100;
      } else if (isMobileLandscape) {
        yOffset = 60; // for animation
      }
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  }
}