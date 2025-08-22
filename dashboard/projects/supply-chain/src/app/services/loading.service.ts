import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private searchingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  searching$ = this.searchingSubject.asObservable();

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setSearching(searching: boolean): void {
    this.searchingSubject.next(searching);
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  get isSearching(): boolean {
    return this.searchingSubject.value;
  }
}