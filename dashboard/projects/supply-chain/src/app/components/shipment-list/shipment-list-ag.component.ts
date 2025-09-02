import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
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
        <div class="grid-header">
          <h3>Shipments ({{ totalRecords }} records)</h3>
          <div class="grid-actions">
            <button class="btn-refresh" (click)="refreshData()" [disabled]="loading">
              {{ loading ? '⏳' : '🔄' }} Refresh
            </button>
            <button class="btn-export" (click)="exportData()">
              📊 Export
            </button>
          </div>
        </div>

        <div class="ag-theme-alpine grid-wrapper">
          <ag-grid-angular
            [rowData]="shipments"
            [columnDefs]="columnDefs"
            [defaultColDef]="defaultColDef"
            [pagination]="true"
            [paginationPageSize]="pageSize"
            [loading]="loading"
            [animateRows]="true"

            [suppressRowClickSelection]="true"
            [rowSelection]="'multiple'"
            (gridReady)="onGridReady($event)"
            (selectionChanged)="onSelectionChanged()"
            class="ag-grid-custom">
          </ag-grid-angular>
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

    .grid-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .grid-header h3 {
      color: #2c3e50;
      margin: 0;
    }

    .grid-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-refresh, .btn-export {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-refresh {
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
    }

    .btn-export {
      background: linear-gradient(45deg, #27ae60, #2ecc71);
      color: white;
    }

    .btn-refresh:hover:not(:disabled), .btn-export:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
    }

    .btn-refresh:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .grid-wrapper {
      height: 600px;
      width: 100%;
      padding: 1rem;
    }

    /* AG Grid Custom Styles */
    ::ng-deep .ag-grid-custom {
      --ag-header-background-color: #f8f9fa;
      --ag-header-foreground-color: #2c3e50;
      --ag-border-color: #e9ecef;
      --ag-row-hover-color: #f8f9fa;
      --ag-selected-row-background-color: #e3f2fd;
    }

    ::ng-deep .ag-grid-custom .ag-header {
      font-weight: 600;
      border-bottom: 2px solid #e9ecef;
    }

    ::ng-deep .ag-grid-custom .ag-row {
      border-bottom: 1px solid #f1f3f4;
    }

    ::ng-deep .ag-grid-custom .ag-row:hover {
      background-color: #f8f9fa;
    }

    /* Status and Priority Badges */
    ::ng-deep .status-badge, ::ng-deep .priority-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    ::ng-deep .status-pending { background: #fff3cd; color: #856404; }
    ::ng-deep .status-in-transit { background: #d1ecf1; color: #0c5460; }
    ::ng-deep .status-delivered { background: #d4edda; color: #155724; }
    ::ng-deep .status-delayed { background: #f8d7da; color: #721c24; }

    ::ng-deep .priority-low { background: #e2e3e5; color: #383d41; }
    ::ng-deep .priority-medium { background: #d1ecf1; color: #0c5460; }
    ::ng-deep .priority-high { background: #fff3cd; color: #856404; }
    ::ng-deep .priority-urgent { background: #f8d7da; color: #721c24; }

    /* Action Buttons */
    ::ng-deep .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    ::ng-deep .btn-action {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    ::ng-deep .btn-action:hover {
      background: #e9ecef;
    }

    /* Modal Styles */
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
  pageSize = 20;
  totalRecords = 0;
  currentFilters: SearchFilters = {};
  selectedShipment: Shipment | null = null;

  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      headerName: 'Tracking #',
      field: 'trackingNumber',
      width: 150,
      pinned: 'left',
      cellRenderer: (params: any) => {
        return `
          <div>
            <strong>${params.value}</strong><br>
            <small style="color: #7f8c8d;">${params.data.weight}kg</small>
          </div>
        `;
      }
    },
    {
      headerName: 'Route',
      field: 'route',
      width: 250,
      cellRenderer: (params: any) => {
        return `
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
            <span>${params.data.origin}</span>
            <span style="color: #3498db; font-weight: bold;">→</span>
            <span>${params.data.destination}</span>
          </div>
        `;
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      cellRenderer: (params: any) => {
        const statusMap: { [key: string]: string } = {
          'pending': 'Pending',
          'in-transit': 'In Transit',
          'delivered': 'Delivered',
          'delayed': 'Delayed'
        };
        return `<span class="status-badge status-${params.value}">${statusMap[params.value] || params.value}</span>`;
      }
    },
    {
      headerName: 'Priority',
      field: 'priority',
      width: 100,
      cellRenderer: (params: any) => {
        return `<span class="priority-badge priority-${params.value}">${params.value.toUpperCase()}</span>`;
      }
    },
    {
      headerName: 'Carrier',
      field: 'carrier',
      width: 130
    },
    {
      headerName: 'Est. Delivery',
      field: 'estimatedDelivery',
      width: 130,
      cellRenderer: (params: any) => {
        const date = new Date(params.value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        let html = `<div>${date}</div>`;
        if (params.data.actualDelivery) {
          const actualDate = new Date(params.data.actualDelivery).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          html += `<small style="color: #27ae60;">Delivered: ${actualDate}</small>`;
        }
        return html;
      }
    },
    {
      headerName: 'Value',
      field: 'value',
      width: 100,
      cellRenderer: (params: any) => {
        return `<strong>$${(params.value / 1000).toFixed(0)}K</strong>`;
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      cellRenderer: (params: any) => {
        return `
          <div class="action-buttons">
            <button class="btn-action" data-action="view" title="View Details">👁️</button>
            <button class="btn-action" data-action="edit" title="Edit">✏️</button>
            <button class="btn-action" data-action="delete" title="Delete">🗑️</button>
          </div>
        `;
      },
      onCellClicked: (params: any) => {
        const action = params.event.target.getAttribute('data-action');
        if (action === 'view') {
          this.viewDetails(params.data);
        } else if (action === 'edit') {
          this.editShipment(params.data);
        } else if (action === 'delete') {
          this.deleteShipment(params.data);
        }
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: false
  };

  constructor(private supplyChainService: SupplyChainService) {
    // Register AG Grid modules
    ModuleRegistry.registerModules([AllCommunityModule]);
  }

  ngOnInit(): void {
    this.loadShipments();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onSelectionChanged(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    console.log('Selected rows:', selectedRows);
  }

  loadShipments(): void {
    this.loading = true;
    this.supplyChainService.getShipments(this.currentFilters, this.currentPage, this.pageSize)
      .subscribe({
        next: (result) => {
          this.shipments = result.data;
          this.totalRecords = result.total;
          this.loading = false;
          console.log('Loaded shipments:', this.shipments);
        },
        error: (error) => {
          console.error('Error loading shipments:', error);
          this.loading = false;
        }
      });
  }

  onFiltersChange(filters: SearchFilters): void {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.loadShipments();
  }

  refreshData(): void {
    this.loadShipments();
  }

  exportData(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: 'shipments-export.csv'
      });
    }
  }

  exportShipments(): void {
    this.exportData();
  }

  viewDetails(shipment: Shipment): void {
    this.selectedShipment = shipment;
  }

  editShipment(shipment: Shipment): void {
    console.log('Editing shipment:', shipment.id);
  }

  deleteShipment(shipment: Shipment): void {
    if (confirm('Are you sure you want to delete this shipment?')) {
      console.log('Deleting shipment:', shipment.id);
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

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }
}