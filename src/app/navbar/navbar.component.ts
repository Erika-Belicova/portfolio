import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;

  @ViewChild('mobileMenu', { static: false }) mobileMenu!: ElementRef;
  @ViewChild('menuToggle', { static: false }) menuToggle!: ElementRef;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInsideMenu = this.mobileMenu?.nativeElement?.contains(event.target);
    const clickedOnToggle = this.menuToggle?.nativeElement?.contains(event.target);

    if (!clickedInsideMenu && !clickedOnToggle) {
      this.closeMenu();
    }
  }

  scrollToSection(id: string, event: Event) {
    event.preventDefault(); // stop href="#" from scrolling to top

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -40; // about 1cm offset above card -> alternative: -window.innerHeight * 0.05 (for 5%)
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  }
}