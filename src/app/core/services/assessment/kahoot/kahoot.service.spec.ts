import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { KahootService } from './kahoot.service';
import { environment } from 'src/environments/environment.development';
import { GenerateQuestion, Question } from '@core/models/kahoot-questions';

describe('KahootService', () => {
  let service: KahootService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KahootService],
    });

    service = TestBed.inject(KahootService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate quiz successfully', () => {
    const mockData: GenerateQuestion = {
      level: 'easy',
      questionType: 'multiple-choice',
      topic: 'science',
    };
    const mockResponse: Question[] = [
      {
        questionText: 'What is the boiling point of water?',
        options: ['100°C', '0°C', '50°C', '25°C'],
        correctAnswer: '100°C',
      },
    ];

    service.generateQuiz(mockData).subscribe((questions) => {
      expect(questions).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.BaseUrl}/quiz/generate`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error in generateQuiz', () => {
    const mockData: GenerateQuestion = {
      level: 'Beginner',
      questionType: 'multiple-choice',
      topic: 'science',
    };
    const mockError = new ErrorEvent('Network error');

    service.generateQuiz(mockData).subscribe(
      () => fail('should have failed with the network error'),
      (error) => {
        expect(error.message).toEqual('Failed to generate quiz');
      }
    );

    const req = httpMock.expectOne(`${environment.BaseUrl}/quiz/generate`);
    expect(req.request.method).toBe('POST');
    req.error(mockError);
  });
});
