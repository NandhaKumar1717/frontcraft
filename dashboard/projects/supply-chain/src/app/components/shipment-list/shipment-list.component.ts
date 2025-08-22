import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { SupplyChainService } from '../../services/supply-chain.service';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { Shipment, SearchFilters } from '../../models/shipment.model';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, AgGridAngular],
  template: `
    <div class="shipment-list-container">
      <app-search-filter 
        (filtersChange)="onFiltersChange($event)"
        (exportRequested)="exportShipments()">
      </app-search-filter>

      <div class="grid-container">
        <div class="table-header">
          <h3>Shipments ({{ totalRecords }} records)</h3>
          <div class="table-actions">
            <button class="btn-refresh" (click)="refreshData()" [disabled]="loading">
              {{ loading ? '⏳' : '🔄' }} Refresh
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="shipments-table">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Route</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Carrier</th>
                <th>Est. Delivery</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let shipment of shipments" class="shipment-row">
                <td>
                  <div class="tracking-cell">
                    <strong>{{ shipment.trackingNumber }}</strong>
                    <small>{{ shipment.weight }}kg</small>
                  </div>
                </td>
                <td>
                  <div class="route-cell">
                    <div class="origin">{{ shipment.origin }}</div>
                    <div class="arrow">→</div>
                    <div class="destination">{{ shipment.destination }}</div>
                  </div>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="'status-' + shipment.status">
                    {{ getStatusDisplay(shipment.status) }}
                  </span>
                </td>
                <td>
                  <span class="priority-badge" [ngClass]="'priority-' + shipment.priority">
                    {{ shipment.priority.toUpperCase() }}
                  </span>
                </td>
                <td>{{ shipment.carrier }}</td>
                <td>
                  <div class="date-cell">
                    {{ formatDate(shipment.estimatedDelivery) }}
                    <small *ngIf="shipment.actualDelivery">
                      Delivered: {{ formatDate(shipment.actualDelivery) }}
                    </small>
                  </div>
                </td>
                <td class="value-cell">\${{ formatCurrency(shipment.value) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-action" (click)="viewDetails(shipment)" title="View Details">
                      👁️
                    </button>
                    <button class="btn-action" (click)="editShipment(shipment)" title="Edit">
                      ✏️
                    </button>
                    <button class="btn-action danger" (click)="deleteShipment(shipment)" title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>Loading shipments...</p>
          </div>

          <div *ngIf="!loading && shipments.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No shipments found</h3>
            <p>Try adjusting your search filters or add a new shipment.</p>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button 
            class="page-btn" 
            [disabled]="currentPage === 1" 
            (click)="changePage(currentPage - 1)">
            ← Previous
          </button>
          
          <div class="page-numbers">
            <button 
              *ngFor="let page of getPageNumbers()" 
              class="page-btn" 
              [ngClass]="{'active': page === currentPage}"
              (click)="changePage(page)">
              {{ page }}
            </button>
          </div>
          
          <button 
            class="page-btn" 
            [disabled]="currentPage === totalPages" 
            (click)="changePage(currentPage + 1)">
            Next →
          </button>
        </div>
      </div>

      <!-- Details Modal -->
      <div class="modal-overlay" *ngIf="selectedShipment" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Shipment Details</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="detail-grid">
              <div class="detail-item">
                <label>Tracking Number:</label>
                <span>{{ selectedShipment.trackingNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Status:</label>
                <span class="status-badge" [ngClass]="'status-' + selectedShipment.status">
                  {{ getStatusDisplay(selectedShipment.status) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Origin:</label>
                <span>{{ selectedShipment.origin }}</span>
              </div>
              <div class="detail-item">
                <label>Destination:</label>
                <span>{{ selectedShipment.destination }}</span>
              </div>
              <div class="detail-item">
                <label>Carrier:</label>
                <span>{{ selectedShipment.carrier }}</span>
              </div>
              <div class="detail-item">
                <label>Priority:</label>
                <span class="priority-badge" [ngClass]="'priority-' + selectedShipment.priority">
                  {{ selectedShipment.priority.toUpperCase() }}
                </span>
              </div>
              <div class="detail-item">
                <label>Weight:</label>
                <span>{{ selectedShipment.weight }} kg</span>
              </div>
              <div class="detail-item">
                <label>Value:</label>
                <span>\${{ formatCurrency(selectedShipment.value) }}</span>
              </div>
              <div class="detail-item">
                <label>Created:</label>
                <span>{{ formatDate(selectedShipment.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <label>Est. Delivery:</label>
                <span>{{ formatDate(selectedShipment.estimatedDelivery) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shipment-list-container {
      background: #f8f9fa;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .table-header h3 {
      color: #2c3e50;
      margin: 0;
    }

    .btn-refresh {
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-refresh:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
    }

    .btn-refresh:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .table-wrapper {
      position: relative;
      overflow-x: auto;
    }

    .shipments-table {
      width: 100%;
      border-collapse: collapse;
    }

    .shipments-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e9ecef;
    }

    .shipments-table td {
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
      vertical-align: middle;
    }

    .shipment-row:hover {
      background: #f8f9fa;
    }

    .tracking-cell strong {
      display: block;
      color: #2c3e50;
    }

    .tracking-cell small {
      color: #7f8c8d;
    }

    .route-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .origin, .destination {
      color: #2c3e50;
    }

    .arrow {
      color: #3498db;
      font-weight: bold;
    }

    .status-badge, .priority-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending { background: #fff3cd; color: #856404; }
    .status-in-transit { background: #d1ecf1; color: #0c5460; }
    .status-delivered { background: #d4edda; color: #155724; }
    .status-delayed { background: #f8d7da; color: #721c24; }

    .priority-low { background: #e2e3e5; color: #383d41; }
    .priority-medium { background: #d1ecf1; color: #0c5460; }
    .priority-high { background: #fff3cd; color: #856404; }
    .priority-urgent { background: #f8d7da; color: #721c24; }

    .date-cell small {
      display: block;
      color: #27ae60;
      font-size: 0.8rem;
    }

    .value-cell {
      font-weight: 600;
      color: #2c3e50;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-action:hover {
      background: #e9ecef;
    }

    .btn-action.danger:hover {
      background: #f8d7da;
      border-color: #f5c6cb;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #7f8c8d;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .page-numbers {
      display: flex;
      gap: 0.5rem;
    }

    .page-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #dee2e6;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;
    }

    .page-btn:hover:not(:disabled) {
      background: #e9ecef;
    }

    .page-btn.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #7f8c8d;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item label {
      font-weight: 600;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .detail-item span {
      color: #2c3e50;
    }
  `]
})
export class ShipmentListComponent implements OnInit {
  shipments: Shipment[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  currentFilters: SearchFilters = {};
  selectedShipment: Shipment | null = null;

  constructor(private supplyChainService: SupplyChainService) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.supplyChainService.getShipments(this.currentFilters, this.currentPage, this.pageSize)
      .subscribe(result => {
        this.shipments = result.data;
        this.totalRecords = result.total;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      });
  }

  onFiltersChange(filters: SearchFilters): void {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.loadShipments();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadShipments();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  refreshData(): void {
    this.loadShipments();
  }

  exportShipments(): void {
    console.log('Exporting shipments...');
    // Implement export functionality
  }

  viewDetails(shipment: Shipment): void {
    this.selectedShipment = shipment;
  }

  editShipment(shipment: Shipment): void {
    console.log('Editing shipment:', shipment.id);
    // Implement edit functionality
  }

  deleteShipment(shipment: Shipment): void {
    if (confirm('Are you sure you want to delete this shipment?')) {
      console.log('Deleting shipment:', shipment.id);
      // Implement delete functionality
    }
  }

  closeModal(): void {
    this.selectedShipment = null;
  }

  getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'in-transit': 'In Transit',
      'delivered': 'Delivered',
      'delayed': 'Delayed'
    };
    return statusMap[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }
}