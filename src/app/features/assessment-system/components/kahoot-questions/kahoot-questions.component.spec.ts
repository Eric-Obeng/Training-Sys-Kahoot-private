import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootQuestionsComponent } from './kahoot-questions.component';

describe('KahootQuestionsComponent', () => {
  let component: KahootQuestionsComponent;
  let fixture: ComponentFixture<KahootQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KahootQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KahootQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
