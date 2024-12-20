import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActiveNavService {
  private currentNav = new BehaviorSubject<string>('Dashboard');
  currentNavSubject$ = this.currentNav.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavFromUrl(event.urlAfterRedirects);
      }
    });
  }

  setcurrentNav(nav: string) {
    this.currentNav.next(nav);
  }

  private updateNavFromUrl(url: string) {
    const match = url.match(/(?:admin|trainer|trainee)\/([^\/]+)/);
    let extractedNav = match ? match[1] : 'Dashboard';
    extractedNav = extractedNav
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    this.setcurrentNav(extractedNav);
  }
}
