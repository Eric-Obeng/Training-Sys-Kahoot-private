import { TestBed } from '@angular/core/testing';

import { GradeManagementService } from './grade-management.service';

describe('GradeManagementService', () => {
  let service: GradeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
