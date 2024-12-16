import { Injectable } from '@angular/core';
import { UserRole } from '@core/models/user-role.interface';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  baseUrl = environment.BaseUrl;

  private userRole: UserRole;

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
    ) {
    const decodedToken = this.tokenService.getDecodedTokenValue();
    this.userRole = decodedToken ? decodedToken.role as UserRole : UserRole.ADMIN;
  }

  getUserRole(): UserRole {
    return this.userRole;
  }

  setUserRole(role: UserRole): void {
    this.userRole = role;
  }

  getTraineeInfo(email: string) {
    return this.http.get<string>(`${this.baseUrl}/profiles/trainees/fetch/${email}`)
  }
  getTrainerInfo(email: string) {
    return this.http.get<string>(`${this.baseUrl}/profiles/trainers/fetch/${email}`)
  }
}
