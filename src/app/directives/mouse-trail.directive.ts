import {
  Directive, ElementRef, Renderer2, HostListener, OnInit, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appMouseTrail]',
  standalone: true,
})
export class MouseTrailDirective implements OnInit {
  private lastTime: number = 0; // last time a particle was created
  private particleDelay: number = 60; // time in ms between particle generation

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      // ensure host can contain absolute children
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
      this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const currentTime = Date.now();

    // prevent trail inside .section-card elements
    const target = e.target as HTMLElement;
    if (target.closest('.section-card')) {
      return;
    }

    // create particle after minimum delay has passed
    if (currentTime - this.lastTime > this.particleDelay) {
      this.createParticle(e);
      this.lastTime = currentTime;
    }
  }

  // mouse click event to generate 6 dots
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    // prevent click trail inside .section-card elements
    if (target.closest('.section-card')) {
      return;
    }

    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 }
    ];

    for (const direction of directions) {
      this.createExplosionDot(e, direction);
    }
  }

  // create particles during mouse movement
  private createParticle(e: MouseEvent): void {
    const dot = this.renderer.createElement('div');
    this.renderer.addClass(dot, 'mouse-trail-dot');

    const size = 5;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    this.renderer.setStyle(dot, 'width', `${size}px`);
    this.renderer.setStyle(dot, 'height', `${size}px`);
    this.renderer.setStyle(dot, 'left', `${x}px`);
    this.renderer.setStyle(dot, 'top', `${y}px`);

    this.renderer.appendChild(this.el.nativeElement, dot);

    setTimeout(() => this.renderer.removeChild(this.el.nativeElement, dot), 1000);
  }

  // 6 dots moving in different directions from the mouse click
  private createExplosionDot(e: MouseEvent, direction: { x: number, y: number }): void {
    const dot = this.renderer.createElement('div');
    this.renderer.addClass(dot, 'mouse-trail-dot');

    const size = 5;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // set initial position at mouse click
    this.renderer.setStyle(dot, 'width', `${size}px`);
    this.renderer.setStyle(dot, 'height', `${size}px`);
    this.renderer.setStyle(dot, 'left', `${x}px`);
    this.renderer.setStyle(dot, 'top', `${y}px`);

    // animate movement of dot
    let offsetX = 0;
    let offsetY = 0;
    const speed = 1;
    const interval = setInterval(() => {
      offsetX += direction.x * speed;
      offsetY += direction.y * speed;

      this.renderer.setStyle(dot, 'left', `${x + offsetX}px`);
      this.renderer.setStyle(dot, 'top', `${y + offsetY}px`);

      // stop the animation after a certain distance
      if (Math.abs(offsetX) > 100 || Math.abs(offsetY) > 100) {
        clearInterval(interval);
        this.renderer.removeChild(this.el.nativeElement, dot); // remove dot after animation
      }
    }, 10);

    this.renderer.appendChild(this.el.nativeElement, dot);
  }
}
