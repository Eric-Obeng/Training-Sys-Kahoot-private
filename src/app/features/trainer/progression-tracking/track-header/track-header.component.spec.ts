import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackHeaderComponent } from './track-header.component';

describe('TrackHeaderComponent', () => {
  let component: TrackHeaderComponent;
  let fixture: ComponentFixture<TrackHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
