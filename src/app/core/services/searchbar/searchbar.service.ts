import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchbarService {

  private searchTerm = new BehaviorSubject<string>('');

  searchTerm$ = this.searchTerm.asObservable(); // observable to subscribe to

  // searchValue: string = '';

  constructor() { }

  setSearchTerm(term: string): void {
    this.searchTerm.next(term);
  }

  getSearchTerm(): string {
    console.log(this.searchTerm.value)
    return this.searchTerm.value;
  }
}
