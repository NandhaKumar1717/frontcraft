import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shipments-page">
      <div class="page-header">
        <div class="header-content">
          <h1>📦 Shipment Management</h1>
          <p>Manage and track all shipments across global supply chain</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="addNewShipment()">
            + New Shipment
          </button>
          <button class="btn-secondary" (click)="bulkImport()">
            📁 Bulk Import
          </button>
        </div>
      </div>

      <div class="quick-filters">
        <button class="filter-chip active" (click)="filterBy('all')">
          All Shipments
        </button>
        <button class="filter-chip" (click)="filterBy('in-transit')">
          In Transit
        </button>
        <button class="filter-chip" (click)="filterBy('delivered')">
          Delivered
        </button>
        <button class="filter-chip" (click)="filterBy('delayed')">
          Delayed
        </button>
        <button class="filter-chip" (click)="filterBy('pending')">
          Pending
        </button>
      </div>

      <div class="simple-table">
        <table>
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Route</th>
              <th>Status</th>
              <th>Carrier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SC001234567</td>
              <td>Shanghai → Los Angeles</td>
              <td>In Transit</td>
              <td>DHL Express</td>
            </tr>
            <tr>
              <td>SC001234568</td>
              <td>Mumbai → London</td>
              <td>Delivered</td>
              <td>FedEx</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .shipments-page {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content h1 {
      color: #2c3e50;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .header-content p {
      color: #7f8c8d;
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .quick-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-chip {
      background: white;
      border: 2px solid #e9ecef;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .filter-chip:hover {
      border-color: #3498db;
      color: #3498db;
    }

    .filter-chip.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    .simple-table {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .simple-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .simple-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
    }

    .simple-table td {
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
  `]
})
export class ShipmentsComponent implements OnInit {

  ngOnInit(): void {}

  addNewShipment(): void {
    console.log('Add new shipment');
  }

  bulkImport(): void {
    console.log('Bulk import shipments');
  }

  filterBy(status: string): void {
    console.log('Filter by:', status);
  }
}