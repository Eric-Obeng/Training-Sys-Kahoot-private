import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserCreationService } from './user-creation.service';
import { environment } from '../../../../environments/environment.development';

describe('UserCreationService', () => {
  let service: UserCreationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserCreationService]
    });
    service = TestBed.inject(UserCreationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createUser and return the response', () => {
    const mockResponse = { success: true };
    const password = 'password123';
    const confirmPassword = 'password123';
    const token = 'test-token';

    service.createUser(password, confirmPassword, token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.BaseUrl}/auth/reset-password`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(JSON.stringify(mockResponse));
  });

  it('should handle non-JSON response', () => {
    const mockResponse = 'Success';
    const password = 'password123';
    const confirmPassword = 'password123';
    const token = 'test-token';

    service.createUser(password, confirmPassword, token).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.BaseUrl}/auth/reset-password`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});
