import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { DecodedToken, LoginResponse, User } from '../../models/iuser';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { UserRoleService } from '../user-role/user-role.service';
import { UserRole } from '@core/models/user-role.interface';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userRoleService: UserRoleService,
    private tokenService: TokenService
  ) {}

  login(
    email: string,
    password: string
  ): Observable<{ success: boolean; token?: string; message?: string }> {
    return this.http
      .post<LoginResponse>(`${environment.BaseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response: LoginResponse) => {
          if (response && response.token) {
            this.tokenService.setToken(response.token);

            const decodedToken = this.tokenService.decodeToken(response.token);

            this.userRoleService.setUserRole(decodedToken.role as UserRole);

            if (response.firstTime) {
              this.router.navigate(['/auth']);
            } else {
              this.routeUser(decodedToken.role);
            }
            return { success: true, token: response.token };
          } else {
            return { success: false, message: 'Invalid credentials' };
          }
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.error.message || 'Login failed')
          );
        })
      );
  }

  resetPassword(email: string): Observable<any> {
    const url = `${environment.BaseUrl}/auth/send-otp?email=${email}`;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420',
    });
    return this.http.post(url, {}, { headers });
  }

  verifyOtp(otp: string): Observable<any> {
    const url = `${environment.BaseUrl}/auth/verify-otp?otp=${otp}`;
    return this.http.post(url, {}, { responseType: 'json' }).pipe(
      map((response: any) => {
        this.tokenService.setToken(response.token);

        try {
          return JSON.parse(response);
        } catch (e) {
          return response;
        }
      })
    );
  }

  decodeToken(token: string): { role: string; email: string } {
    const decoded: DecodedToken = jwtDecode(token);
    return { role: decoded.role, email: decoded.email };
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      const isExpired = this.tokenService.isTokenExpired(token);
      if (!isExpired) {
        return true;
      }
    }
    this.handleTokenExpiration();
    return false;
  }

  handleTokenExpiration() {
    this.logout();
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/auth/login']);
  }

  getUserRole(): string {
    const token = this.tokenService.getToken();
    if (token) {
      const decodedToken = this.tokenService.decodeToken(token);
      return decodedToken.role;
    }
    return '';
  }

  private routeUser(role: string): void {
    switch (role) {
      case 'TRAINER':
        this.router.navigate(['/home/trainer']).catch(() => {});
        break;
      case 'TRAINEE':
        this.router.navigate(['/home/trainee']).catch(() => {});
        break;
      case 'ADMIN':
        this.router.navigate(['/home/admin']).catch(() => {});
        break;
      default:
        this.router.navigate(['/auth/login']).catch(() => {});
        break;
    }
  }
}
