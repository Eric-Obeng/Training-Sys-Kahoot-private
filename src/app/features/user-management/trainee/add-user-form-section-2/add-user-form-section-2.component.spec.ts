import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserFormSection2Component } from './add-user-form-section-2.component';

describe('AddUserFormSection2Component', () => {
  let component: AddUserFormSection2Component;
  let fixture: ComponentFixture<AddUserFormSection2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserFormSection2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUserFormSection2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
