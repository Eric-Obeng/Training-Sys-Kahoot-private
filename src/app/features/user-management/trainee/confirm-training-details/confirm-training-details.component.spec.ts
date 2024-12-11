import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTrainingDetailsComponent } from './confirm-training-details.component';

describe('ConfirmTrainingDetailsComponent', () => {
  let component: ConfirmTrainingDetailsComponent;
  let fixture: ComponentFixture<ConfirmTrainingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmTrainingDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmTrainingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
