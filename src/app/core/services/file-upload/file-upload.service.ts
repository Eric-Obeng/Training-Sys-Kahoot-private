import { Injectable } from '@angular/core';
import { uploadedFile } from '@core/models/file.interface';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  readonly allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'application/pdf'];
 
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  handleFile(file: File): uploadedFile | null {
    if (this.isAllowedFileType(file.type)) {
      return {
        file: file,
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type
      };
    }
    return null;
  }
  
  isAllowedFileType(fileType: string): boolean {
    return this.allowedFileTypes.includes(fileType);
  }
  
  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) {
      return '../../../../../../../assets/Images/png/pdf-icon.png';
    } else if (fileType.includes('image')) {
      return '../../../../../../../assets/Images/svg/image-icon.svg';
    }
    return '../../../../../../../assets/Images/svg/file-icon.svg';
  }
}