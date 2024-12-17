import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { GenerateByAiComponent } from './generate-by-ai.component';
import { KahootService } from '@core/services/assessment/kahoot/kahoot.service';

describe('GenerateByAiComponent', () => {
  let component: GenerateByAiComponent;
  let fixture: ComponentFixture<GenerateByAiComponent>;
  let kahootService: KahootService;

  beforeEach(async () => {
    const kahootServiceMock = {
      generateQuiz: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [GenerateByAiComponent],
      providers: [{ provide: KahootService, useValue: kahootServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateByAiComponent);
    component = fixture.componentInstance;
    kahootService = TestBed.inject(KahootService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dropdown options on init', () => {
    component.ngOnInit();
    expect(component.levels).toEqual([
      { name: 'Beginner' },
      { name: 'Intermediate' },
      { name: 'Advanced' },
    ]);
    expect(component.questionType).toEqual([
      { name: 'True/False' },
      { name: 'Multiple choice' },
      { name: 'Image based' },
    ]);
    expect(component.includeCode).toEqual([
      { name: 'No' },
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'C#' },
    ]);
  });

  it('should generate quiz on valid form submission', () => {
    const quizResponse = [{ id: 1, question: 'Sample Question' }];
    kahootService.generateQuiz = jest.fn().mockReturnValue(of(quizResponse));

    component.generateQuizForm.setValue({
      level: { name: 'Beginner' },
      questionType: { name: 'True/False' },
      includeCode: { name: 'No' },
      topic: 'Sample Topic',
    });

    component.onSubmit();

    expect(kahootService.generateQuiz).toHaveBeenCalledWith({
      level: 'Beginner',
      questionType: 'True/False',
      includeCode: 'No',
      topic: 'Sample Topic',
    });
    expect(component.quizzes).toEqual(quizResponse);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error on quiz generation failure', () => {
    const errorResponse = new Error('Failed to generate quiz');
    kahootService.generateQuiz = jest.fn().mockReturnValue(throwError(() => errorResponse));

    component.generateQuizForm.setValue({
      level: { name: 'Beginner' },
      questionType: { name: 'True/False' },
      includeCode: { name: 'No' },
      topic: 'Sample Topic',
    });

    component.onSubmit();

    expect(kahootService.generateQuiz).toHaveBeenCalledWith({
      level: 'Beginner',
      questionType: 'True/False',
      includeCode: 'No',
      topic: 'Sample Topic',
    });
    expect(component.quizzes).toEqual([]);
    expect(component.isLoading).toBe(false);
  });
});
