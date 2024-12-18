import { TestBed } from '@angular/core/testing';

import { TraineeInsystemService } from './trainee-insystem.service';

describe('TraineeInsystemService', () => {
  let service: TraineeInsystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineeInsystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
