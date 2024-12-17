import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootPageComponent } from './kahoot-page.component';

describe('KahootPageComponent', () => {
  let component: KahootPageComponent;
  let fixture: ComponentFixture<KahootPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KahootPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KahootPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
