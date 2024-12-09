import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent {

}
