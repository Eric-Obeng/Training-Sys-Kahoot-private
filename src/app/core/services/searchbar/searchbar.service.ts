import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchbarService {

  private searchValue = new BehaviorSubject<string>('');

  constructor() { }

  updateSearchTerm(term: string): void {
    this.searchValue.next(term);
  }
}
