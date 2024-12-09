import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyHintComponent } from './empty-hint.component';

describe('EmptyHintComponent', () => {
  let component: EmptyHintComponent;
  let fixture: ComponentFixture<EmptyHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyHintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmptyHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
