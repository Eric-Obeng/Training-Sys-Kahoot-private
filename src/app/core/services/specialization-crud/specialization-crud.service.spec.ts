import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpecializationCrudService } from './specialization-crud.service';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { environment } from '../../../../environments/environment.development';
import { specialization } from '../../models/specialization.interface';

describe('SpecializationCrudService', () => {
  let service: SpecializationCrudService;
  let httpMock: HttpTestingController;
  let mockErrorService: jest.Mocked<ErrorHandleService>;

  const mockSpecialization: specialization = {
    id: 1,
    name: 'Test Specialization',
    description: 'Test Description',
    prerequisites: [],
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    mockErrorService = {
      handleError: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SpecializationCrudService,
        { provide: ErrorHandleService, useValue: mockErrorService }
      ]
    });

    service = TestBed.inject(SpecializationCrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllSpecializations', () => {
    it('should fetch all specializations', () => {
      const mockResponse = [mockSpecialization];

      service.getAllSpecializations().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('ngrok-skip-browser-warning')).toBe('69420');
      req.flush(mockResponse);
    });

    it('should handle error', () => {
      service.getAllSpecializations().subscribe({
        error: () => {
          expect(mockErrorService.handleError).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getSpecializationById', () => {
    it('should fetch specialization by id', () => {
      service.getSpecializationById(1).subscribe(response => {
        expect(response).toEqual(mockSpecialization);
      });

      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSpecialization);
    });
  });

  describe('createSpecialization', () => {
    it('should create new specialization', () => {
      service.createSpecialization(mockSpecialization).subscribe(response => {
        expect(response).toEqual(mockSpecialization);
      });

      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSpecialization);
      req.flush(mockSpecialization);
    });
  });

  describe('updateSpecialization', () => {
    it('should update specialization', () => {
      const updatedSpec = { ...mockSpecialization, name: 'Updated' };

      service.updateSpecialization(1, updatedSpec).subscribe(response => {
        expect(response).toEqual(updatedSpec);
      });

      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedSpec);
      req.flush(updatedSpec);
    });
  });

  describe('deleteSpecialization', () => {
    it('should delete specialization', () => {
      service.deleteSpecialization(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Additional CRUD Test Scenarios', () => {
    it('should handle error when fetching specialization by id', () => {
      service.getSpecializationById(999).subscribe({
        error: () => {
          expect(mockErrorService.handleError).toHaveBeenCalled();
        }
      });
      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/999`);
      req.error(new ErrorEvent('Not Found'));
    });

    it('should handle error when creating specialization', () => {
      service.createSpecialization({} as specialization).subscribe({
        error: () => {
          expect(mockErrorService.handleError).toHaveBeenCalled();
        }
      });
      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations`);
      req.error(new ErrorEvent('Bad Request'));
    });

    it('should handle error when updating specialization', () => {
      const updatedSpec = { ...mockSpecialization, name: 'Updated' };
      service.updateSpecialization(999, updatedSpec).subscribe({
        error: () => {
          expect(mockErrorService.handleError).toHaveBeenCalled();
        }
      });
      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/999`);
      req.error(new ErrorEvent('Not Found'));
    });

    it('should handle error when deleting specialization', () => {
      service.deleteSpecialization(999).subscribe({
        error: () => {
          expect(mockErrorService.handleError).toHaveBeenCalled();
        }
      });
      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/999`);
      req.error(new ErrorEvent('Not Found'));
    });

    it('should handle creating specialization with minimum data', () => {
      const minimalSpec: specialization = {
        id: 0,
        name: '',
        description: '',
        prerequisites: [],
        createdAt: ''
      };
      service.createSpecialization(minimalSpec).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(minimalSpec);
      req.flush(minimalSpec);
    });

    it('should handle partial update of specialization', () => {
      const partialUpdate = { name: 'Partial Update' };
      service.updateSpecialization(1, partialUpdate).subscribe(response => {
        expect(response.name).toBe('Partial Update');
      });
      const req = httpMock.expectOne(`${environment.BaseUrl}/specializations/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(partialUpdate);
      req.flush({ ...mockSpecialization, ...partialUpdate });
    });
  });
});
