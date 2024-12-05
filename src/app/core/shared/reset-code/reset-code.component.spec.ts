import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetCodeComponent } from './reset-code.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../services/token/token.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

describe('ResetCodeComponent', () => {
  let component: ResetCodeComponent;
  let fixture: ComponentFixture<ResetCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetCodeComponent],
      providers: [
        FormBuilder,
        AuthService,
        Router,
        TokenService,
        ActivatedRoute,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
