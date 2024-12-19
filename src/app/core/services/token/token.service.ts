import { Injectable } from '@angular/core';
import { DecodedToken } from '@core/models/iuser';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenSubject = new BehaviorSubject<DecodedToken | null>(null);

  constructor() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.setToken(storedToken);
    }
  }

  setToken(token: string) {
    try {
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode<DecodedToken>(token);
      this.tokenSubject.next(decodedToken);
    } catch (error) {
      console.error('Invalid token specified:', error);
      this.clearToken();
    }
  }

  getDecodedToken() {
    return this.tokenSubject.asObservable();
  }

  getDecodedTokenValue() {
    return this.tokenSubject.value;
  }

  clearToken() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  decodeToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token);
  }
}
