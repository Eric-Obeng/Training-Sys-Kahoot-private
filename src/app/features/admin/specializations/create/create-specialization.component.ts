import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from "../form/form.component";
import { SpecializationFacadeService } from '@core/services/specialization-facade/specialization-facade.service';
import { specialization } from '@core/models/specialization.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of,timer } from 'rxjs';
import { AddFeedbackComponent } from "../add-feedback/add-feedback.component";
import { ErrorHandleService } from '@core/services/error-handle/error-handle.service';


@Component({
  selector: 'app-create-specialization',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormComponent, AddFeedbackComponent,],
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
    private route: ActivatedRoute,
    private errorService: ErrorHandleService
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
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.showErrorSnackbar('Error fetching specialization:'+ error.message);
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
        const successMessage = this.specializationData?.id ?
          'Specialization updated successfully!' :
          'Specialization created successfully!';
        this.errorService.showSuccessSnackbar(successMessage);

        timer(3000).subscribe(() => {
          this.showFeedback = false;
          this.navigateToList();
        });
      },
      error: (error: HttpErrorResponse) => {
        const operation = this.specializationId ? 'updating' : 'creating';
        const errorMessage = error.message || `Error ${operation} specialization. Please try again.`;
        this.errorService.showErrorSnackbar(errorMessage);
      }
    });
  }


  navigateToList(){
    this.router.navigate(['home','admin','specialization-management'])
  }
}


