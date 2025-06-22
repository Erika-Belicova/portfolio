import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
  jobs = [
    {
      title: 'Frontend Developer – Company',
      period: 'Jan 2020 – Present',
      details: [
        'Built and maintained Angular apps',
        'Collaborated closely with UX/UI team',
        'Focused on responsive and accessible design'
      ],
      tech: 'JavaScript • HTML • CSS • Angular • TypeScript • SQL'
    },
    {
      title: 'Web Developer – Company',
      period: 'Aug 2018 – Dec 2019',
      details: [
        'Built and maintained Angular apps',
        'Collaborated closely with UX/UI team',
        'Focused on responsive and accessible design'
      ],
      tech: 'JavaScript • HTML • CSS • Angular • TypeScript • SQL'
    },
    {
      title: 'Software Engineer – Company',
      period: 'Jan 2017 – Aug 2018',
      details: [
        'Built and maintained Angular apps',
        'Collaborated closely with UX/UI team',
        'Focused on responsive and accessible design'
      ],
      tech: 'JavaScript • HTML • CSS • Angular • TypeScript • SQL'
    },
    {
      title: 'Intern Developer – Company',
      period: 'Jun 2016 – Dec 2016',
      details: [
        'Built and maintained Angular apps',
        'Collaborated closely with UX/UI team',
        'Focused on responsive and accessible design'
      ],
      tech: 'JavaScript • HTML • CSS • Angular • TypeScript • SQL'
    }
  ];

  showDetails: boolean[] = [];

  ngOnInit() {
    // initialize all toggles as false (collapsed)
    this.showDetails = this.jobs.map(() => false);
  }

  toggleDetails(index: number) {
    this.showDetails[index] = !this.showDetails[index];
  }

  get allExpanded(): boolean {
    return this.showDetails.every(d => d);
  }

  expandAll() {
    this.showDetails = this.showDetails.map(() => true);
  }

  collapseAll() {
    this.showDetails = this.showDetails.map(() => false);
  }

  toggleAll() {
    const allOpen = this.showDetails.every(state => state);
    if (allOpen) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }
}
