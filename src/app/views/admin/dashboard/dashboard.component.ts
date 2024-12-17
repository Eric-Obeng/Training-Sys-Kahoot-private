import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

interface TrainingSession {
  topic: string;
  specialization: string;
  trainer: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products: TrainingSession[] = [
    {
      topic: 'Research Biases',
      specialization: 'UI/UX Design',
      trainer: 'Lisa Koomson',
      time: '1:30pm',
    },
    {
      topic: 'CSS Flexbox & Grids',
      specialization: 'Front-end Dev',
      trainer: 'Adjei Fred',
      time: '12:30pm',
    },
    {
      topic: 'RESTful API Design',
      specialization: 'Back-end Dev',
      trainer: 'Ntumi Elias',
      time: '10:30am',
    },
    {
      topic: 'Unit Testing with Jest',
      specialization: 'Quality Assurance',
      trainer: 'Philip Halie',
      time: '09:30am',
    },
    {
      topic: 'Unit Testing with Jest',
      specialization: 'Quality Assurance',
      trainer: 'Philip Halie',
      time: '09:30am',
    },
    {
      topic: 'Unit Testing with Jest',
      specialization: 'Quality Assurance',
      trainer: 'Philip Halie',
      time: '09:30am',
    },
  ];
}
