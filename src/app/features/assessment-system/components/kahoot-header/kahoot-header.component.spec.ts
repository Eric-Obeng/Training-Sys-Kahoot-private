import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootHeaderComponent } from './kahoot-header.component';

describe('KahootHeaderComponent', () => {
  let component: KahootHeaderComponent;
  let fixture: ComponentFixture<KahootHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KahootHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KahootHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
