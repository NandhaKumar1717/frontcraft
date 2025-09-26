import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, ModuleRegistry, AllCommunityModule, GridApi } from 'ag-grid-community';
import { SupplyChainService } from '../../services/supply-chain.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
<div class="shipments-container">
  <div class="page-header">
    <div class="header-content">
      <h1>Shipments</h1>
      <p>Manage shipment data</p>
    </div>
    <div class="header-actions">
      <button class="btn-primary" (click)="addNewShipment()">
        ➕ New Shipment
      </button>
    </div>
  </div>

  <div class="toolbar">
    <div class="toolbar-left">
      <div class="search-box">
        <input 
          type="text" 
          placeholder="🔍 Quick search..." 
          [(ngModel)]="searchText"
          (input)="onQuickFilterChanged()"
          class="search-input">
      </div>
      <button class="tool-btn" (click)="resetFilters()" title="Reset Filters">
        🔄 Reset
      </button>
    </div>
    
    <div class="toolbar-right">
      <div class="selection-info" *ngIf="selectedRows.length > 0">
        {{ selectedRows.length }} selected
      </div>
      <button class="tool-btn" (click)="bulkUpdateStatus()" [disabled]="selectedRows.length === 0">
        ✏️ Bulk Edit
      </button>
      <button class="tool-btn danger" (click)="bulkDelete()" [disabled]="selectedRows.length === 0">
        🗑️ Delete
      </button>
      <button class="tool-btn" (click)="exportToCsv()">
        📄 Export CSV
      </button>
    </div>
  </div>

  <div class="grid-container">
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      [rowData]="shipmentData"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [gridOptions]="gridOptions"
      [sideBar]="sideBar"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="onSelectionChanged()"
      style="height: 600px; width: 100%;">
    </ag-grid-angular>
  </div>

  <div class="status-bar">
    <div class="status-item">
      <span class="status-label">Total Records:</span>
      <span class="status-value">{{ shipmentData.length }}</span>
    </div>
    <div class="status-item">
      <span class="status-label">Selected:</span>
      <span class="status-value">{{ selectedRows.length }}</span>
    </div>
  </div>
</div>
  `,
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  
  shipmentData: any[] = [];
  selectedRows: any[] = [];
  searchText = '';
  
  columnDefs: ColDef[] = [
    { 
      field: 'select',
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left'
    },
    { 
      field: 'trackingId', 
      headerName: 'Tracking ID', 
      width: 160, 
      pinned: 'left',
      filter: 'agTextColumnFilter',
      cellStyle: { fontWeight: 'bold', color: '#2563eb' }
    },
    { 
      field: 'origin', 
      headerName: 'Origin', 
      width: 140, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'destination', 
      headerName: 'Destination', 
      width: 150, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      filter: 'agTextColumnFilter',
      cellRenderer: this.statusCellRenderer,
      enableRowGroup: true
    },
    { 
      field: 'carrier', 
      headerName: 'Carrier', 
      width: 160, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120,
      filter: 'agTextColumnFilter',
      cellRenderer: this.priorityCellRenderer,
      enableRowGroup: true
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 140, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'region', 
      headerName: 'Region', 
      width: 150, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'value', 
      headerName: 'Value', 
      width: 120,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => `$${params.value.toLocaleString()}`,
      cellStyle: { textAlign: 'right', fontWeight: '600' }
    },
    { 
      field: 'weight', 
      headerName: 'Weight (kg)', 
      width: 120,
      filter: 'agNumberColumnFilter',
      cellStyle: { textAlign: 'right' }
    },
    { 
      field: 'customer', 
      headerName: 'Customer', 
      width: 180, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'customerType', 
      headerName: 'Type', 
      width: 120, 
      filter: 'agTextColumnFilter',
      enableRowGroup: true
    },
    { 
      field: 'shipDate', 
      headerName: 'Ship Date', 
      width: 130, 
      filter: 'agDateColumnFilter'
    },
    { 
      field: 'estimatedDelivery', 
      headerName: 'Est. Delivery', 
      width: 140, 
      filter: 'agDateColumnFilter'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      cellRenderer: this.actionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    floatingFilter: true
  };

  gridOptions: GridOptions = {
    rowHeight: 45,
    headerHeight: 50,
    animateRows: true,
    pagination: true,
    paginationPageSize: 50,
    paginationPageSizeSelector: [25, 50, 100, 200],
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    enableRangeSelection: true,
    rowGroupPanelShow: 'onlyWhenGrouping'
  };

  sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel'
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel'
      }
    ],
    defaultToolPanel: 'columns'
  };

  constructor(private supplyChainService: SupplyChainService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.supplyChainService.getShipments().subscribe(data => {
      this.shipmentData = data;
    });
  }

  statusCellRenderer(params: any): string {
    const status = params.value;
    const className = status.toLowerCase().replace(' ', '-');
    const icons = {
      'in-transit': '🚚',
      'delivered': '✅',
      'processing': '⏳',
      'delayed': '⚠️',
      'pending': '⏸️'
    };
    const icon = icons[className as keyof typeof icons] || '📦';
    return `<span class="status-badge ${className}"><span class="status-icon">${icon}</span>${status}</span>`;
  }

  priorityCellRenderer(params: any): string {
    const priority = params.value;
    const className = priority.toLowerCase();
    const icons = {
      'low': '🔵',
      'medium': '🟡',
      'high': '🟠',
      'urgent': '🔴'
    };
    const icon = icons[className as keyof typeof icons] || '⚪';
    return `<span class="priority-badge ${className}"><span class="priority-icon">${icon}</span>${priority}</span>`;
  }

  actionsCellRenderer(params: any): string {
    return `
      <div class="action-buttons">
        <button class="action-btn edit" onclick="window.editShipment('${params.data.trackingId}')" title="Edit">✏️</button>
        <button class="action-btn delete" onclick="window.deleteShipment('${params.data.trackingId}')" title="Delete">🗑️</button>
      </div>
    `;
  }

  onGridReady(params: any): void {
    // Set up global functions for action buttons
    (window as any).editShipment = (trackingId: string) => this.editShipment(trackingId);
    (window as any).deleteShipment = (trackingId: string) => this.deleteShipment(trackingId);
  }

  onSelectionChanged(): void {
    this.selectedRows = this.agGrid.api.getSelectedRows();
  }

  onQuickFilterChanged(): void {
    this.agGrid.api.setGridOption('quickFilterText', this.searchText);
  }

  exportToExcel(): void {
    this.agGrid.api.exportDataAsExcel({
      fileName: 'shipments-export.xlsx'
    });
  }

  exportToCsv(): void {
    this.agGrid.api.exportDataAsCsv({
      fileName: 'shipments-export.csv'
    });
  }

  bulkDelete(): void {
    if (this.selectedRows.length === 0) {
      alert('Please select rows to delete');
      return;
    }
    
    if (confirm(`Delete ${this.selectedRows.length} selected shipments?`)) {
      console.log('Bulk delete:', this.selectedRows);
      // Implement bulk delete logic
    }
  }

  bulkUpdateStatus(): void {
    if (this.selectedRows.length === 0) {
      alert('Please select rows to update');
      return;
    }
    
    const newStatus = prompt('Enter new status:');
    if (newStatus) {
      console.log('Bulk update status:', this.selectedRows, newStatus);
      // Implement bulk update logic
    }
  }

  addNewShipment(): void {
    console.log('Add new shipment');
    // Implement add new shipment logic
  }

  editShipment(trackingId: string): void {
    console.log('Edit shipment:', trackingId);
    // Implement edit shipment logic
  }

  deleteShipment(trackingId: string): void {
    if (confirm(`Delete shipment ${trackingId}?`)) {
      console.log('Delete shipment:', trackingId);
      // Implement delete shipment logic
    }
  }

  resetFilters(): void {
    this.agGrid.api.setFilterModel(null);
    this.agGrid.api.setGridOption('quickFilterText', '');
    this.searchText = '';
    this.loadData();
  }

  autoSizeColumns(): void {
    this.agGrid.api.autoSizeAllColumns();
  }
}