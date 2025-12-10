import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WakeService {
  private readonly subdomains = [
    "https://api.estate.erika-belicova.com/swagger-ui/index.html",
    "https://olympic-games.erika-belicova.com",
    "https://yoga.erika-belicova.com",
    "https://mdd.erika-belicova.com",
    "https://api-mdd.erika-belicova.com",
    "https://api-mdd.erika-belicova.com/swagger-ui/index.html",
  ];

  constructor() { }

  wakeApps(): void {
    this.subdomains.forEach(url => {
      fetch(url, { mode: "no-cors" }).catch(() => { });
    });
  }
}
