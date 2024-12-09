
import { Routes } from '@angular/router';
import { AssessmentTabsSecondComponent } from '@features/grade-management/assessment-tabs-second/assessment-tabs-second.component';
import { WelcomePageComponent } from '@features/grade-management/welcome-page/welcome-page.component';


export const trainerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: WelcomePageComponent,
    data: { role: 'trainer' }
  },
  {
    path: 'assessment',
    loadComponent : ()=> import('@views/trainer/assessment/assessment.component')
    .then(m => m.AssessmentComponent),
    data: { role: 'trainerer' }
  },
  {
    path: 'grade-management',
    loadComponent : ()=> import('@views/trainer/grade-management/grade-management.component')
    .then(m => m.GradeManagementComponent),
    data: { role: 'trainer' },
    children: [
      {
        path: '',
        loadComponent: () => import('../../features/grade-management/assessment-tabs/assessment-tabs.component')
        .then(m => m.AssessmentTabsComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('../../features/grade-management/view-assessment-list/view-assessment-list.component')
            .then(m => m.ViewAssessmentListComponent),
          },
          {
            path: 'trainee-list',
            loadComponent: () => import('../../features/grade-management/view-ungraded-trainees-list/trainees-list/trainees-list.component')
            .then(m => m.TraineesListComponent),
          },
          {
            path: 'graded-trainees-list',
            loadComponent: () => import('../../features/grade-management/graded-trainees-list/graded-trainees-list.component')
            .then(m => m.GradedTraineesListComponent),
          },
        ]
      },
      {
        path: 'grade-history',
        loadComponent: () => import('../../features/grade-management/assessment-tabs-second/assessment-tabs-second.component')
        .then(m => m.AssessmentTabsSecondComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('../../features/grade-management/view-grade-history-list/view-grade-history/view-grade-history.component')
            .then(m => m.ViewGradeHistoryComponent), 
          },
          {
            path: 'assessment-overview',
            loadComponent: () => import('../../features/grade-management/assessment-overview/assessment-overview.component')
            .then(m => m.AssessmentOverviewComponent)
          }
        ]
      },
    ]
  },
  {
    path: 'trainee-management',
    loadComponent: () => import('@views/trainer/trainee-management/trainee-management.component')
    .then(m => m.TraineeManagementComponent),
    data: { role: 'trainer' }
  },
  {
    path: 'curriculum',
    loadComponent: () => import('@views/admin/curriculum/curriculum.component')
    .then(m => m.CurriculumComponent),
    data: { role: 'trainer' }
  },
  {
    path: 'progress-tracking',
    loadComponent: () => import('@views/trainer/progress-tracking/progress-tracking.component')
    .then(m => m.ProgressTrackingComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('@views/trainer/attendance/attendance.component')
    .then(m => m.AttendanceComponent),
    data: { role: 'trainer' }
  },
  {
    path: 'report',
    loadComponent: () => import('@views/trainer/reports/reports.component')
    .then(m => m.ReportsComponent),
    data: { role: 'trainer' }
  },
  {
    path:'settings',
    loadComponent: () => import('@views/settings/settings.component')
    .then(m => m.SettingsComponent),
    data: { role: 'trainer' }
  },
  {
    path:'help',
    loadComponent: () => import('@views/help/help.component')
    .then(m => m.HelpComponent),
    data: { role: 'trainer' }
  }

];
