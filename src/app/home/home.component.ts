import { Component } from '@angular/core';
import { MouseTrailDirective } from '../directives/mouse-trail.directive';

@Component({
  selector: 'app-home',
  imports: [MouseTrailDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}