import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WakeService {
  private readonly subdomains = [
    "https://api.estate.erika-belicova.site/swagger-ui/index.html/",
    "https://olympic-games.erika-belicova.site/",
    "https://yoga.erika-belicova.site/"
  ];

  constructor() { }

  wakeApps(): void {
    this.subdomains.forEach(url => {
      fetch(url, { mode: "no-cors" }).catch(() => { });
    });
  }
}
