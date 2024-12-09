import { CurriculumListComponent } from './../../../features/admin/curriculum/curriculum-list/curriculum-list.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmptyHintComponent } from '../../../features/admin/curriculum/empty-hint/empty-hint.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss',
})
export class CurriculumComponent {
  curriculum: string[] = [];
}
