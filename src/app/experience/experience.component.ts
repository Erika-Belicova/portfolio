import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  allExpanded = false;
  showDetails: boolean[] = [false, false, false, false, false]; // five jobs

  toggleDetails(index: number) {
    this.showDetails[index] = !this.showDetails[index];
  }

  toggleAll() {
    this.allExpanded = !this.allExpanded;
    this.showDetails = this.showDetails.map(() => this.allExpanded);
  }

  scrollToTimeline() {
    const timelineElement = document.getElementById('timeline');
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;

    const offset = 100; // pixels to scroll past bottom

    // scroll position: timeline top + timeline height * 2 - viewport height + offset
    const targetScrollTop = scrollY + rect.top + rect.height - viewportHeight + offset;

    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });
  }
}
