import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
import { NavbarComponent } from './navbar/navbar.component';
import { CreativeCodingComponent } from './creative-coding/creative-coding.component';
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { EducationComponent } from "./education/education.component";
import { SkillsComponent } from "./skills/skills.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ContactComponent } from "./contact/contact.component";
import { FooterComponent } from "./footer/footer.component";
import { ExperienceComponent } from './experience/experience.component';
import { MouseTrailDirective } from './directives/mouse-trail.directive';
import { ScrollArrowButtonComponent } from './scroll-arrow-button/scroll-arrow-button.component';
import { WakeService } from './wake.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:
    [NavbarComponent,
      CreativeCodingComponent,
      HomeComponent,
      AboutComponent,
      EducationComponent,
      ExperienceComponent,
      SkillsComponent,
      ProjectsComponent,
      ContactComponent,
      FooterComponent,
      MouseTrailDirective,
      ScrollArrowButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'portfolio';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private wakeService: WakeService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({ once: false });

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.wakeService.wakeApps());
      } else {
        // fallback for older browsers
        setTimeout(() => this.wakeService.wakeApps(), 200);
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.refresh();
    }
  }

  scrollToSection(id: string, event?: Event) {
    event?.preventDefault();

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -40; // adjust this to control the offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  }
}