import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmContactDetailsComponent } from './confirm-contact-details.component';

describe('ConfirmContactDetailsComponent', () => {
  let component: ConfirmContactDetailsComponent;
  let fixture: ComponentFixture<ConfirmContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmContactDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
