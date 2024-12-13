import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit,signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { curriculum,module } from '@core/models/curriculum.interface';
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { FileUploadService } from '@core/services/file-upload/file-upload.service';
import { AccordionModule } from 'primeng/accordion';
import { extractFileNameFromUrl } from '@core/utils/urlToFile';
import { convertISODurationToMinutes, formatDuration} from '@core/utils/duration';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [ DatePipe,MatDivider,NgClass,NgIf,
    NgFor,AccordionModule, TitleCasePipe,MatTooltipModule,],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})

export class DetailComponent implements OnInit{
  curriculum: curriculum | null = null;
  activeSection =  signal<'overview' | 'modules'>('overview');

  constructor(
    private route: ActivatedRoute,
    private curriculumFacade: CurriculumFacadeService,
    private fileService: FileUploadService
  ) {}


  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'].toString(); 
      this.curriculumFacade.getSelectedCurriculum(id).subscribe(
        (curriculum) => {
          this.curriculum = curriculum;          
        }
      );
    });
  }

  private calculateTotalDuration(modules: module[]): number {
    return modules.reduce((total, module) => {
      const minutes = convertISODurationToMinutes(module.estimatedTime);
      return total + minutes;
    }, 0);
  }
  

  getTotalDuration(): string {
    if (!this.curriculum?.modules) return '0 minutes';
    const total = this.calculateTotalDuration(this.curriculum.modules);
    return formatDuration(total);
  }

  showFileType(fileUrl: string){
    this.fileService.getFileIcon(fileUrl)
  }
  
  extractFileName(fileUrl: string): string {
    return extractFileNameFromUrl(fileUrl);
  }

  setActiveDetail(section: 'overview' | 'modules') {
    this.activeSection.set(section)
  }

  totalTopics (){
    return this.curriculum?.modules?.reduce(
      (sum, module) => sum + module.topics.length, 0
    ) || 0;
  }
}
