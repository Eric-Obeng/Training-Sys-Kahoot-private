import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootSidebarComponent } from './kahoot-sidebar.component';

describe('KahootSidebarComponent', () => {
  let component: KahootSidebarComponent;
  let fixture: ComponentFixture<KahootSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KahootSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KahootSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
