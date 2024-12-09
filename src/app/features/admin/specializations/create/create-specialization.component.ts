import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from "../form/form.component";
import { SpecializationFacadeService } from '@core/services/specialization-facade/specialization-facade.service';
import { specialization } from '@core/models/specialization.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of,timer } from 'rxjs';
import { AddFeedbackComponent } from "../add-feedback/add-feedback.component";


@Component({
  selector: 'app-create-specialization',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormComponent, RouterLink, AddFeedbackComponent],
  templateUrl: './create-specialization.component.html',
  styleUrl: './create-specialization.component.scss'
})

export class CreateSpecializationComponent {
  specializationData?: specialization;
  specializationId?: number;
  isLoading: boolean = false;
  showFeedback: boolean = false;

  constructor(private router: Router,
    private facadeService: SpecializationFacadeService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.route.queryParams.pipe(
      switchMap(params => {
        const id = params['id'];
        if (id) {
          this.isLoading = true;
          return this.facadeService.getSpecializationById(id);
        }
        return of(undefined);
      })
    ).subscribe({
      next: (specialization) => {
        this.specializationData = specialization;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching specialization:', error);
        this.isLoading = false;
      }
    });
  }

  handleFormSubmit(formData: specialization) {
    const formOperation = this.specializationData?.id ?
      this.facadeService.update(this.specializationData.id, formData)
      : this.facadeService.create(formData);
    formOperation.subscribe({
      next: () => {
        this.showFeedback = true;
        timer(3000).subscribe(()=>{
          this.showFeedback = false;
          this.navigateToList()
        })
      },
      error: (error) => {
        this.handleError(error)
      }
    })
  }

   private handleError(error: any): void {
    const operation = this.specializationId ? 'updating' : 'creating';
    throw new Error(`Error ${operation} specialization: ${error}`);
  }

  navigateToList(){
    this.router.navigate(['home','admin','specialization-management'])
  }
}


