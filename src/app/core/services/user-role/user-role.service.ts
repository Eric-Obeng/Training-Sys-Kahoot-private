import { Injectable } from '@angular/core';
import { UserRole } from '@core/models/user-role.interface';

@Injectable({
  providedIn: 'root'
})

export class UserRoleService {
  private userRole: UserRole = UserRole.TRAINEE;


  getUserRole(): UserRole {
    return this.userRole;
  }

  setUserRole(role: UserRole): void {
    this.userRole = role;
  }


}
