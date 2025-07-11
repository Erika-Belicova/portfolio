import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, CreativeCodingComponent, HomeComponent, AboutComponent, EducationComponent, ExperienceComponent, SkillsComponent, ProjectsComponent, ContactComponent, FooterComponent, MouseTrailDirective, ScrollArrowButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'portfolio';

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.setActualViewportHeight();
      window.addEventListener('resize', this.setActualViewportHeight);
    }
  }

  // cleanup to prevent memory leaks
  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.setActualViewportHeight);
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

  private setActualViewportHeight = () => {
    if (typeof window !== 'undefined') {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  };
}