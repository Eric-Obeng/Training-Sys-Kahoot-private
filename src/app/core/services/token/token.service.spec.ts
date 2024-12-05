import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { DecodedToken } from '@core/models/iuser';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('TokenService', () => {
  let service: TokenService;
  const mockToken = 'mockToken';
  const mockDecodedToken: DecodedToken = {
    email: 'admin@example.com',
    role: 'ADMIN',
    exp: 1234567890,
  };

  beforeEach(() => {
    localStorage.clear();
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    TestBed.configureTestingModule({
      providers: [TokenService],
    });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and decode token', () => {
    service.setToken(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(service.getDecodedTokenValue()).toEqual(mockDecodedToken);
  });

  it('should get decoded token as observable', (done) => {
    service.setToken(mockToken);
    service.getDecodedToken().subscribe((decodedToken) => {
      expect(decodedToken).toEqual(mockDecodedToken);
      done();
    });
  });

  it('should clear token', () => {
    service.setToken(mockToken);
    service.clearToken();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getDecodedTokenValue()).toBeNull();
  });
});
