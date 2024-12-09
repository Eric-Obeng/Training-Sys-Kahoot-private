import { TestBed } from '@angular/core/testing';

import { CurriculumStateService } from './curriculum-state.service';

describe('CurriculumStateService', () => {
  let service: CurriculumStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurriculumStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
