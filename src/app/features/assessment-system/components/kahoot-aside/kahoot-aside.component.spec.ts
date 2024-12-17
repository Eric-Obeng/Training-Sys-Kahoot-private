import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootAsideComponent } from './kahoot-aside.component';

describe('KahootAsideComponent', () => {
  let component: KahootAsideComponent;
  let fixture: ComponentFixture<KahootAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KahootAsideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KahootAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
