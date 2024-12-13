import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DecodedToken } from '@core/models/iuser';
import { Assignment, Quiz } from '@core/models/trainee.interface';
import { TokenService } from '@core/services/token/token.service';
import { TraineeQuizService } from '@core/services/trainee-quiz/trainee-quiz.service';
import { QuizService } from '@core/services/trainee/quiz-questions/quiz.service';
import { SearchQuizService } from '@core/services/trainee/search-quiz.service';
import { BehaviorSubject, Observable, combineLatest, filter, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, TitleCasePipe],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent {
  @Input() assessmentType = ''; // Set title for quiz type
  @Output() dataEmpty = new EventEmitter<boolean>(); 

  quizCount = 0;
  totallyEmpty!: boolean;
  decodedToken!: DecodedToken | null;
  traineeEmail!: string | undefined;


  assessments$!: Observable<Assignment[]>; // holds the filtered data
  // filteredAssessment$!: Observable<Assignment[]>; // holds the filtered data
  filteredAssessment$!: Observable<any[]>; // holds the filtered data

  showmore: boolean = true;

  
  constructor(
    private router: Router,
    private searchQuiz: SearchQuizService,
    private traineeAssessentsService: TraineeQuizService,
    private tokenService: TokenService,
  ) {}


  // Sample data to use for assessment (to be removed)
  // quizes: Quiz[] = [
  //   {
  //     quizCount: 5,
  //     assignments: [
  //       {
  //         id: 1,
  //         title: "Quiz 1: Introduction to JavaScript",
  //         dateCreated: "2024-01-15",
  //         type: "Quiz",
  //         action: "Take Now",
  //         questionCount: 2,
  //       },
  //       {
  //         id: 2,
  //         title: "Quiz 2: HTML Basics",
  //         dateCreated: "2024-01-18",
  //         type: "Lab",
  //         action: "Take Now",
  //         questionCount: 2,
  //       },
  //       {
  //         id: 3,
  //         title: "Quiz 3: CSS Styling",
  //         dateCreated: "2024-01-20",
  //         type: "Presentation",
  //         action: "Take Now",
  //         questionCount: 1,
  //       },
  //       {
  //         id: 4,
  //         title: "Quiz 4: Advanced JavaScript",
  //         dateCreated: "2024-01-25",
  //         type: "Quiz",
  //         action: "Take Now",
  //         questionCount: 2,
  //       },
  //       {
  //         id: 5,
  //         title: "Quiz 5: Angular Fundamentals",
  //         dateCreated: "2024-01-30",
  //         type: "Lab",
  //         action: "Take Now",
  //         questionCount: 2,
  //       },
  //       {
  //         "id": 6,
  //         "title": "Quiz 6: TypeScript Basics",
  //         "dateCreated": "2024-02-05",
  //         "type": "Quiz",
  //         "action": "Take Now",
  //         "questionCount": 3
  //       },
  //       {
  //         "id": 7,
  //         "title": "Quiz 7: React Introduction",
  //         "dateCreated": "2024-02-10",
  //         "type": "Lab",
  //         "action": "Take Now",
  //         "questionCount": 4
  //       },
  //       {
  //         "id": 8,
  //         "title": "Quiz 8: Web Development Best Practices",
  //         "dateCreated": "2024-02-15",
  //         "type": "Presentation",
  //         "action": "Take Now",
  //         "questionCount": 2
  //       },
  //       {
  //         "id": 9,
  //         "title": "Quiz 9: Frontend Frameworks",
  //         "dateCreated": "2024-02-18",
  //         "type": "Quiz",
  //         "action": "Take Now",
  //         "questionCount": 5
  //       },
  //       {
  //         "id": 10,
  //         "title": "Quiz 10: Backend Development with Node.js",
  //         "dateCreated": "2024-02-22",
  //         "type": "Lab",
  //         "action": "Take Now",
  //         "questionCount": 3
  //       },
  //       {
  //         "id": 11,
  //         "title": "Quiz 11: Database Design Fundamentals",
  //         "dateCreated": "2024-02-25",
  //         "type": "Presentation",
  //         "action": "Take Now",
  //         "questionCount": 4
  //       },
  //       {
  //         "id": 12,
  //         "title": "Quiz 12: DevOps Essentials",
  //         "dateCreated": "2024-03-01",
  //         "type": "Quiz",
  //         "action": "Take Now",
  //         "questionCount": 3
  //       },
  //       {
  //         "id": 13,
  //         "title": "Quiz 13: Cloud Computing Overview",
  //         "dateCreated": "2024-03-05",
  //         "type": "Lab",
  //         "action": "Take Now",
  //         "questionCount": 2
  //       },
  //       {
  //         "id": 14,
  //         "title": "Quiz 14: Advanced CSS Techniques",
  //         "dateCreated": "2024-03-08",
  //         "type": "Presentation",
  //         "action": "Take Now",
  //         "questionCount": 1
  //       },
  //       {
  //         "id": 15,
  //         "title": "Quiz 15: Software Testing and Quality Assurance",
  //         "dateCreated": "2024-03-12",
  //         "type": "Quiz",
  //         "action": "Take Now",
  //         "questionCount": 3
  //       }
  //     ]
  //   }
  // ];
  
  ngOnInit() {
    this.init();
  }

  init() {
    //Get email from decoded token
    this.decodedToken = this.tokenService.getDecodedTokenValue()
    this.traineeEmail = this.decodedToken?.email;

    this.assessments$ = this.traineeAssessentsService.getAllAssignments(this.traineeEmail)
    this.assessments$.subscribe(data => console.log(data))


    this.filteredAssessment$ = combineLatest([
      this.assessments$,
      this.searchQuiz.searchTerm$
    ]).pipe(
      map(([assessments, searchTerm]) => {
        // Filter assignments by search term
        const title = assessments.filter((quiz:any) => quiz.assessment.title)
        console.log("title: ", title)
        return title;
        // return assessments.filter(assignment =>
        //   assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
        // );
      })
    );

    this.filteredAssessment$.subscribe(fitleredAssignments => {
      this.quizCount = fitleredAssignments.length;
    })

  }


  

  toggleShowMore() {
    this.showmore = !this.showmore;
  }

  
  takeAssessment(id: number, quizType: string) {
    if(quizType === 'Quiz') {
      this.router.navigate([`home/trainee/assessments/quiz/${id}`]);
    }
    else if(quizType === 'Lab') {
      this.router.navigate([`home/trainee/assessments/lab/${id}`]);
    }
    else if(quizType === 'Presentation') {
      this.router.navigate([`home/trainee/assessments/presentation/${id}`]);
    }
  }
}
