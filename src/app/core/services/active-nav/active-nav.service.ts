import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { UserRoleService } from '../user-role/user-role.service';
import { TokenService } from '../token/token.service';
import { DecodedToken } from '@core/models/iuser';

@Injectable({
  providedIn: 'root'
})
export class ActiveNavService {
  private currentNav = new BehaviorSubject<string>('Dashboard');
  currentNavSubject$ = this.currentNav.asObservable();

  userFirstName: string | null = 'User';

  constructor(
    private router: Router,
    private roleService: UserRoleService,
    private tokenService: TokenService
  ) {
    this.initializeService();
  }

  private initializeService() {

    const userRole = this.roleService.getUserRole();
    if (userRole === 'ADMIN') {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateNavFromUrl(event.urlAfterRedirects);
        }
      });
    } else {
      this.setcurrentNav(`Welcome ${this.userFirstName}`);
    }
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
