import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SearchFilters } from '../../models/shipment.model';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-filter-container">
      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search by tracking number, origin, destination..."
            [(ngModel)]="filters.searchTerm"
            (input)="onSearchInput($event)"
            class="search-input">
          <button class="search-btn">
            <span *ngIf="!(searching$ | async)">🔍</span>
            <span *ngIf="searching$ | async" class="search-spinner">⏳</span>
          </button>
        </div>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Status</label>
          <select [(ngModel)]="filters.status" (change)="onFilterChange()" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Priority</label>
          <select [(ngModel)]="filters.priority" (change)="onFilterChange()" class="filter-select">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Carrier</label>
          <input 
            type="text" 
            placeholder="Enter carrier name"
            [(ngModel)]="filters.carrier"
            (input)="onFilterChange()"
            class="filter-input">
        </div>

        <div class="filter-actions">
          <button class="btn-clear" (click)="clearFilters()">Clear All</button>
          <button class="btn-export" (click)="exportData()">📊 Export</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-filter-container {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }

    .search-section {
      margin-bottom: 1.5rem;
    }

    .search-box {
      display: flex;
      max-width: 500px;
      position: relative;
    }

    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      border-color: #3498db;
    }

    .search-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.6;
    }

    .search-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .filters-section {
      display: flex;
      gap: 1.5rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 150px;
    }

    .filter-group label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .filter-select,
    .filter-input {
      padding: 0.8rem;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.3s;
    }

    .filter-select:focus,
    .filter-input:focus {
      border-color: #3498db;
    }

    .filter-actions {
      display: flex;
      gap: 1rem;
      margin-left: auto;
    }

    .btn-clear,
    .btn-export {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-clear {
      background: #f8f9fa;
      color: #6c757d;
      border: 1px solid #dee2e6;
    }

    .btn-clear:hover {
      background: #e9ecef;
    }

    .btn-export {
      background: linear-gradient(45deg, #27ae60, #2ecc71);
      color: white;
    }

    .btn-export:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(39, 174, 96, 0.3);
    }

    @media (max-width: 768px) {
      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-actions {
        margin-left: 0;
        justify-content: center;
      }
    }
  `]
})
export class SearchFilterComponent implements OnDestroy {
  @Output() filtersChange = new EventEmitter<SearchFilters>();
  @Output() exportRequested = new EventEmitter<void>();

  filters: SearchFilters = {
    searchTerm: '',
    status: '',
    priority: '',
    carrier: ''
  };

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  searching$ = this.loadingService.searching$;

  constructor(private loadingService: LoadingService) {
    // Debounced search for better UX
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filters.searchTerm = searchTerm;
      this.loadingService.setSearching(false);
      this.filtersChange.emit({ ...this.filters });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: any): void {
    const searchTerm = event.target.value;
    this.loadingService.setSearching(true);
    this.searchSubject.next(searchTerm);
  }

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  clearFilters(): void {
    this.filters = {
      searchTerm: '',
      status: '',
      priority: '',
      carrier: ''
    };
    this.loadingService.setSearching(false);
    this.onFilterChange();
  }

  exportData(): void {
    this.exportRequested.emit();
  }
}