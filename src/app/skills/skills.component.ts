import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

type SectionKey = 'fullStackDetails' | 'frontEndDetails' | 'backEndDetails';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
   skillSections = [
    {
      title: 'Front-end',
      colorClass: 'text-blue-300',
      items: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'RxJS', 'VS Code'],
    },
    {
      title: 'Back-end',
      colorClass: 'text-indigo-300',
      items: ['Java', 'JEE', 'Spring', 'Spring Boot', 'Hibernate', 'Spring Security', 'SQL'],
    },
    {
      title: 'Databases',
      colorClass: 'text-[#AFB1F4]',
      items: ['MySQL', 'PostgreSQL'],
    },
    {
      title: 'Version Control',
      colorClass: 'text-blue-300',
      items: ['Git', 'GitHub', 'TortoiseSVN'],
    },
  ];

  // an icon for each technology
  getIconFilename(tech: string): string {
    const map: { [key: string]: string } = {
      'VS Code': 'visualstudiocode.svg',
      'Spring Boot': 'springboot.svg',
      'Spring': 'spring.svg',
      'RxJS': 'rxjs.svg',
      'GitHub': 'github.svg',
      'Git': 'git.svg',
      'TypeScript': 'typescript.svg',
      'HTML': 'html5.svg',
      'CSS': 'css.svg',
      'PostgreSQL': 'postgresql.svg',
      'TortoiseSVN': 'tortoisesvn.svg',
      'MySQL': 'mysql.svg',
      'Hibernate': 'hibernate.svg',
      'Angular': 'angular.svg',
      'SQL': 'sql.svg',
      'Java': 'java.svg',
      'JavaScript': 'javascript.svg',
      'JEE': 'java.svg'
    };
  
    return map[tech] || `${tech.toLowerCase().replace(/\s+/g, '')}.svg`;
  }

  // ViewChild to access the header and section elements
  @ViewChild('fullStackSection', { static: false }) fullStackSection: ElementRef<HTMLElement> | undefined;
  @ViewChild('fullStackHeader', { static: false }) fullStackHeader: ElementRef<HTMLElement> | undefined;

  @ViewChild('frontEndSection', { static: false }) frontEndSection: ElementRef<HTMLElement> | undefined;
  @ViewChild('frontEndHeader', { static: false }) frontEndHeader: ElementRef<HTMLElement> | undefined;

  @ViewChild('backEndSection', { static: false }) backEndSection: ElementRef<HTMLElement> | undefined;
  @ViewChild('backEndHeader', { static: false }) backEndHeader: ElementRef<HTMLElement> | undefined;

  // toggle visibility state
  isSectionVisible = {
    fullStackDetails: false,
    frontEndDetails: false,
    backEndDetails: false
  };

  toggleSection(section: 'fullStackDetails' | 'frontEndDetails' | 'backEndDetails') {

    // leaving space for navbar
    const scrollOffset = 120;

    const sectionMap = {
      fullStackDetails: {
        header: this.fullStackHeader,
        content: this.fullStackSection,
      },
      frontEndDetails: {
        header: this.frontEndHeader,
        content: this.frontEndSection,
      },
      backEndDetails: {
        header: this.backEndHeader,
        content: this.backEndSection,
      }
    };

    const { header, content } = sectionMap[section];

    if (this.isSectionVisible[section]) {
      // COLLAPSING: scroll first
      this.scrollToSection(header, scrollOffset);
  
      // delay to match fade-out
      setTimeout(() => {
        this.isSectionVisible[section] = false;
      }, 500);
    } else {
      // EXPANDING: show immediately
      this.isSectionVisible[section] = true;
  
      // scroll after expanding
      this.scrollToSection(content, scrollOffset);
    }
  }

  // method to handle scrolling
  private scrollToSection(target: ElementRef<HTMLElement> | undefined, offset: number) {
    if (target) {
      const topPosition = target.nativeElement.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  }

}
