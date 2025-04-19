import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import AOS from 'aos';
import 'aos/dist/aos.css';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
}).then(() => {
  AOS.init();
}).catch((err) => console.error(err));
