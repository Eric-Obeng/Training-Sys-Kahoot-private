import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { SpecializationFacadeService } from './specialization-facade.service';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { SpecializationCrudService } from '../specialization-crud/specialization-crud.service';
import { specialization } from '../../models/specialization.interface';

describe('SpecializationFacadeService', () => {
  let service: SpecializationFacadeService;
  let mockErrorService: jest.Mocked<ErrorHandleService>;
  let mockSpecializationCrud: jest.Mocked<SpecializationCrudService>;

  const mockSpecializations: specialization[] = [
    {
      id: 1,
      name: 'Spec 1',
      description: 'Description 1',
      prerequisites: [],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Spec 2',
      description: 'Description 2',
      prerequisites: [],
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    mockErrorService = {
      handleError: jest.fn((error) => throwError(() => error))
    } as any;

    mockSpecializationCrud = {
      getAllSpecializations: jest.fn().mockReturnValue(of(mockSpecializations)),
      getSpecializationById: jest.fn().mockReturnValue(of(mockSpecializations[0])),
      createSpecialization: jest.fn().mockReturnValue(of(mockSpecializations[0])),
      updateSpecialization: jest.fn().mockReturnValue(of(mockSpecializations[0])),
      deleteSpecialization: jest.fn().mockReturnValue(of(void 0))
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SpecializationFacadeService,
        { provide: ErrorHandleService, useValue: mockErrorService },
        { provide: SpecializationCrudService, useValue: mockSpecializationCrud }
      ]
    });

    service = TestBed.inject(SpecializationFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadSpecializations', () => {
    it('should load and sort specializations on initialization', (done) => {
      service.specialization$.subscribe(specs => {
        expect(specs).toEqual([mockSpecializations[1], mockSpecializations[0]]); // desc order by default
        expect(mockSpecializationCrud.getAllSpecializations).toHaveBeenCalled();
        done();
      });
    });

    it('should handle error when loading specializations', () => {
      const error = new Error('Test error');
      mockSpecializationCrud.getAllSpecializations.mockReturnValue(throwError(() => error));

      const consoleSpy = jest.spyOn(console, 'error');
      service['loadSpecializations']();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error occurred while fetching specializations:',
        error
      );
    });
  });

  describe('toggleSort', () => {
    it('should toggle sort direction and reload specializations', (done) => {
      service.sortDirection$.subscribe(direction => {
        expect(direction).toBe('desc'); // Initial value

        service.toggleSort();

        service.sortDirection$.subscribe(newDirection => {
          expect(newDirection).toBe('asc');
          expect(mockSpecializationCrud.getAllSpecializations).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('getSpecializationById', () => {
    it('should fetch and set selected specialization', (done) => {
      const mockSpec = mockSpecializations[0];

      service.getSpecializationById(1).subscribe(() => {
        service.selectedSpecialization$.subscribe(selected => {
          expect(selected).toEqual(mockSpec);
          expect(mockSpecializationCrud.getSpecializationById).toHaveBeenCalledWith(1);
          done();
        });
      });
    });

    it('should handle error when fetching specialization', (done) => {
      const error = new Error('Test error');
      mockSpecializationCrud.getSpecializationById.mockReturnValue(throwError(() => error));

      service.getSpecializationById(1).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(mockErrorService.handleError).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  describe('CRUD operations', () => {
    it('should create specialization and reload list', (done) => {
      const newSpec = { ...mockSpecializations[0], id: 3 };
      mockSpecializationCrud.createSpecialization.mockReturnValue(of(newSpec));

      service.create(newSpec).subscribe(() => {
        expect(mockSpecializationCrud.createSpecialization).toHaveBeenCalledWith(newSpec);
        expect(mockSpecializationCrud.getAllSpecializations).toHaveBeenCalled();
        done();
      });
    });

    it('should update specialization and reload list', (done) => {
      const updatedSpec = { ...mockSpecializations[0], name: 'Updated' };
      mockSpecializationCrud.updateSpecialization.mockReturnValue(of(updatedSpec));

      service.update(1, updatedSpec).subscribe(() => {
        expect(mockSpecializationCrud.updateSpecialization).toHaveBeenCalledWith(1, updatedSpec);
        expect(mockSpecializationCrud.getAllSpecializations).toHaveBeenCalled();
        done();
      });
    });

    it('should delete specialization and reload list', (done) => {
      service.delete(1).subscribe(() => {
        expect(mockSpecializationCrud.deleteSpecialization).toHaveBeenCalledWith(1);
        expect(mockSpecializationCrud.getAllSpecializations).toHaveBeenCalled();
        done();
      });
    });
  });
});
