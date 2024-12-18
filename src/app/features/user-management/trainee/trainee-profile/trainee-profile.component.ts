import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/cohort.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trainee-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './trainee-profile.component.html',
  styleUrl: './trainee-profile.component.scss'
})
export class TraineeProfileComponent implements OnInit {
  traineeProfileForm!: FormGroup;

  public isdisabled = true;
  private userData!: string;

  constructor(
    private fb: FormBuilder,
    private traineeInSystemService: TraineeInsystemService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadTraineeData();
  }

  private initForm() {
    this.traineeProfileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      trainingId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      universityCompleted: ['', Validators.required],
      specialization: ['', Validators.required],
      enrollementDate: ['', Validators.required],
      status: ['', Validators.required],
      userProfilePhoto: ['']
    });

    if (this.isdisabled) {
      this.traineeProfileForm.disable();
    }
  }

  private loadTraineeData() {
    this.traineeInSystemService.selectedTrainee$.subscribe((data) => {
      if (data) {
        this.traineeProfileForm.patchValue(data);
        this.userData = data.email;
      }
    });
  }

  //For updating changes to profile
  updateForm() {
    this.toggleEditForm()
    this.traineeInSystemService.updateUserData(this.traineeProfileForm, this.userData)
  }

  toggleEditForm() {
    this.isdisabled = !this.isdisabled;
    if (this.isdisabled) {
      this.traineeProfileForm.disable();
    } else {
      this.traineeProfileForm.enable();
    }
  }
}