import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class SvgService {
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon(
      'books',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/svg/books-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'info',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/svg/info.svg')
    );
    iconRegistry.addSvgIcon(
      'add-image',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/svg/add-image-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'dots',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/svg/dot-menu.svg')
    );

  }
}
