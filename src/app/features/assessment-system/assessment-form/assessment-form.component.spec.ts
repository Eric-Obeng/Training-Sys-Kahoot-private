import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AssessmentFormComponent } from './assessment-form.component';

describe('AssessmentFormComponent', () => {
  let component: AssessmentFormComponent;
  let fixture: ComponentFixture<AssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AssessmentFormComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'type' ? 'lab' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      assessmentType: 'lab',
      title: '',
      focusArea: '',
      description: '',
      coverImage: null,
      attachments: [],
    });
  });

  it('should update form value when cover image is selected', () => {
    const file = new File([''], 'cover-image.png');
    const event = { target: { files: [file] } };
    component.onCoverImageSelected(event);
    expect(component.selectedFileName).toBe('cover-image.png');
    expect(component.form.get('coverImage')?.value).toBe(file);
  });

  it('should update form value when files are selected', () => {
    const file1 = new File([''], 'file1.png');
    const file2 = new File([''], 'file2.png');
    const event = { target: { files: [file1, file2] } };
    component.onFileSelected(event);
    expect(component.form.get('attachments')?.value).toEqual([file1, file2]);
  });

  it('should emit form data on submit if form is valid', () => {
    jest.spyOn(component.formSubmit, 'emit');
    component.form.patchValue({
      title: 'Test Title',
      focusArea: 'Test Focus Area',
      description: 'Test Description',
    });
    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      assessmentType: 'lab',
      title: 'Test Title',
      focusArea: 'Test Focus Area',
      description: 'Test Description',
      coverImage: null,
      attachments: [],
    });
  });

  it('should not emit form data on submit if form is invalid', () => {
    jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });
});
