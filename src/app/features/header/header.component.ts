import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserRoleService } from '../../core/services/user-role/user-role.service';
import { TitleCasePipe } from '@angular/common';
import { ButtonStateService } from '../../core/services/buttonState/buttonstate.service';
import { ActiveNavService } from '@core/services/active-nav/active-nav.service';
import { TokenService } from '@core/services/token/token.service';
import { DecodedToken } from '@core/models/iuser';
import { User } from '@core/models/cohort.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  canUseBtn!: boolean;
  dropDownClicked: boolean = false;
  routeName!: string;
  userRole!: string;
  userName!: string;

  decodedToken!: DecodedToken | null;
  userEmail!: string | undefined;

  @Output() activatePlusBtn = new EventEmitter<void>();

  constructor(
    private router: Router,
    private userRoleService: UserRoleService,
    private buttonStateService: ButtonStateService,
    private activeNav: ActiveNavService,
    private tokenService: TokenService
  ) {}

  public toggleDropDownBtn() {
    this.dropDownClicked = !this.dropDownClicked;
  }

  ngOnInit(): void {
    // Subscribe to the currentNavSubject$ observable
    this.activeNav.currentNavSubject$.subscribe(data => {
      this.routeName = data;
    });

    this.decodeToken();
    // Get user role
    this.userRole = this.userRoleService.getUserRole();

    this.getUserDetails()

    // Set routeName immediately on component load, in case the NavigationEnd hasn't fired yet
    this.updateRouteName();

    // Subscribe to NavigationEnd events to capture route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteName();
        this.runAfterViewInitLogic();
      });
  }

  decodeToken() {
    this.decodedToken = this.tokenService.getDecodedTokenValue()
    this.userEmail = this.decodedToken?.email;
  }

  getUserDetails() {
    if(this.userRole === 'TRAINEE') {
      this.userRoleService.getTraineeInfo(this.userEmail || '').subscribe({
        next: (res: any) => { 
          this.userName = res.firstName;
          this.activeNav.userFirstName = res.firsName;
        }
      })
    }
    else if(this.userRole === 'TRAINER') {
      this.userRoleService.getTrainerInfo(this.userEmail || '').subscribe({
        next: (res: any) => { 
          this.userName = res.firstName;
        }
      })
    }
    else if(this.userRole === 'ADMIN') {
      this.userName = 'Admin'
    }
  }

  // trigger emitter
  public triggerPlusBtn() {
    this.activatePlusBtn.emit();
  }

  private runAfterViewInitLogic(): void {
    this.buttonStateService.canUseBtn$.subscribe((state) => {
      this.canUseBtn = state;
    });
  }

  private updateRouteName(): void {
    this.activeNav.currentNavSubject$.subscribe((activeNav) => {
      this.routeName = activeNav;
    });
  }

  onLogout() {
    this.tokenService.clearToken();
    this.router.navigate(['/auth/login']);
  }

  goToProfile() {
    this.router.navigate(['/home/admin/user-management/user-profile'])
  }
}
