import { TestBed } from '@angular/core/testing';

import { TrackingCrudService } from './tracking-crud.service';

describe('TrackingCrudService', () => {
  let service: TrackingCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
