import { Component, ElementRef, HostListener, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

const LANG_META: Record<string, { flag: string; label: string }> = {
  fr: { flag: '🇫🇷', label: 'Français' },
  en: { flag: '🇬🇧', label: 'English' },
  sk: { flag: '🇸🇰', label: 'Slovenčina' },
  de: { flag: '🇩🇪', label: 'Deutsch' },
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isMenuOpen = false;

  @ViewChild('mobileMenu', { static: false }) mobileMenu!: ElementRef;
  @ViewChild('menuToggle', { static: false }) menuToggle!: ElementRef;

  constructor(
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get currentLang(): string {
    return this.translate.currentLang ?? this.translate.defaultLang;
  }

  getLangLabel(lang: string): string {
    return LANG_META[lang]?.label ?? lang.toUpperCase();
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }

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
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}