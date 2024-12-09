import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Observable, of, map } from 'rxjs';

@Component({
  selector: 'app-view-assignments',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './view-assignments.component.html',
  styleUrl: './view-assignments.component.scss'
})
export class ViewAssignmentsComponent {

  @Input() cardType = ''; // set component to graded or ungraded
  filteredAssignments: any[] = []; // holds the filtered data


  // Sample data to use for assessment (to be removed)
  assessments = [
    {
      "cardType": "Ungraded Assignments",
      "totalQuizzes": 5,
      "assignments": [
        {
          "id": 1,
          "title": "Introduction to Frontend Frameworks",
          "dateCreated": "2024-06-01",
          "type": "Quiz",
          "action": "Grade Now"
        },
        {
          "id": 2,
          "title": "Responsive Design Workshop",
          "dateCreated": "2024-06-02",
          "type": "Project",
          "action": "Grade Now"
        },
        {
          "id": 3,
          "title": "JavaScript Basics Assessment",
          "dateCreated": "2024-06-03",
          "type": "Open Ended",
          "action": "Grade Now"
        },
        {
          "id": 4,
          "title": "CSS Flexbox Mastery",
          "dateCreated": "2024-06-04",
          "type": "Quiz",
          "action": "Grade Now"
        }
      ]
    },
    {
      "cardType": "Graded Assignments",
      "totalQuizzes": 5,
      "assignments": [
        {
          "id": 1,
          "title": "React Components Evaluation",
          "dateCreated": "2024-06-01",
          "type": "Quiz",
          "gradedTrainees": 20
        },
        {
          "id": 2,
          "title": "Angular Directives Exercise",
          "dateCreated": "2024-06-02",
          "type": "Project",
          "gradedTrainees": 20
        },
        {
          "id": 3,
          "title": "TypeScript Fundamentals",
          "dateCreated": "2024-06-03",
          "type": "Open Ended",
          "gradedTrainees": 20
        },
        {
          "id": 4,
          "title": "Advanced DOM Manipulation",
          "dateCreated": "2024-06-04",
          "type": "Quiz",
          "gradedTrainees": 20
        }
      ]
    }
  ];

  ngOnInit() {

  }


  init() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cardType']) {
      this.filterAssignments();
    }
  }

  filterAssignments(): void {
    const selectedAssessment = this.assessments.find(
      assessment => assessment.cardType === this.cardType
    );
    this.filteredAssignments = selectedAssessment
      ? selectedAssessment.assignments
      : [];
    console.log(selectedAssessment)
  }
  
} 
