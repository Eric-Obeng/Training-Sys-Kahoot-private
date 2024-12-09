import { Component } from '@angular/core';
import { EmptyHintComponent } from '../empty-hint/empty-hint.component';
import { HeaderComponent } from './header/header.component';
import { ListItemComponent } from './list-item/list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curriculum-list',
  standalone: true,
  imports: [EmptyHintComponent,HeaderComponent,ListItemComponent,CommonModule],
  templateUrl: './curriculum-list.component.html',
  styleUrl: './curriculum-list.component.scss',
})

export class CurriculumListComponent {

  curriculum :string[] =[]
}
