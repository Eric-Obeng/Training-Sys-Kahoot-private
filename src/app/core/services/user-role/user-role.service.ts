import { Injectable } from '@angular/core';
import { UserRole } from '@core/models/user-role.interface';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private userRole: UserRole;

  constructor(private tokenService: TokenService) {
    const decodedToken = this.tokenService.getDecodedTokenValue();
    this.userRole = decodedToken ? decodedToken.role as UserRole : UserRole.ADMIN;
  }

  getUserRole(): UserRole {
    return this.userRole;
  }

  setUserRole(role: UserRole): void {
    this.userRole = role;
  }
}