import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterSubject = new BehaviorSubject<string | null>('')
  filterValue$: Observable<string | null> = this.filterSubject.asObservable();

  constructor() { }


}
