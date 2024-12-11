import { TestBed } from '@angular/core/testing';

import { UserManagementTraineeService } from './user-management-trainee.service';

describe('UserManagementTraineeService', () => {
  let service: UserManagementTraineeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagementTraineeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
