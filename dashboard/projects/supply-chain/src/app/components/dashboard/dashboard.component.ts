import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplyChainService } from '../../services/supply-chain.service';

import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsCardsComponent, ChartsComponent],
  template: `
    <div class="dashboard-container">
        <header class="dashboard-header">
          <div class="header-content">
            <h1>Dashboard Overview</h1>
            <p>Real-time logistics management across 47 countries</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="openAddShipment()">
              + New Shipment
            </button>
          </div>
        </header>

        <app-stats-cards></app-stats-cards>
        <app-charts></app-charts>
        <div class="simple-table">
          <h3>Recent Shipments</h3>
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

      <!-- Add Shipment Modal -->
      <div class="modal-overlay" *ngIf="showAddShipmentModal" (click)="closeAddShipmentModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>🚛 Create New Shipment</h3>
            <button class="close-btn" (click)="closeAddShipmentModal()">×</button>
          </div>
          <div class="modal-body">
            <form class="shipment-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Tracking Number</label>
                  <input type="text" [(ngModel)]="newShipment.trackingNumber" readonly class="form-input readonly">
                </div>
                <div class="form-group">
                  <label>Priority</label>
                  <select [(ngModel)]="newShipment.priority" class="form-select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Origin *</label>
                  <input type="text" [(ngModel)]="newShipment.origin" placeholder="e.g., Shanghai, China" class="form-input" required>
                </div>
                <div class="form-group">
                  <label>Destination *</label>
                  <input type="text" [(ngModel)]="newShipment.destination" placeholder="e.g., Los Angeles, USA" class="form-input" required>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Weight (kg) *</label>
                  <input type="number" [(ngModel)]="newShipment.weight" placeholder="0" class="form-input" required>
                </div>
                <div class="form-group">
                  <label>Value (USD) *</label>
                  <input type="number" [(ngModel)]="newShipment.value" placeholder="0" class="form-input" required>
                </div>
              </div>
              
              <div class="form-group">
                <label>Carrier *</label>
                <select [(ngModel)]="newShipment.carrier" class="form-select" required>
                  <option value="">Select Carrier</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="Maersk">Maersk</option>
                  <option value="COSCO">COSCO</option>
                  <option value="Emirates SkyCargo">Emirates SkyCargo</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeAddShipmentModal()">Cancel</button>
            <button class="btn-primary" (click)="saveShipment()" [disabled]="!isFormValid()">Create Shipment</button>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: calc(100vh - 140px);
    }

    .dashboard-header {
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

    .btn-primary {
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #5a6268;
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
      backdrop-filter: blur(5px);
    }

    .modal-content {
      background: white;
      border-radius: 15px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-bottom: 1px solid #e9ecef;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px 15px 0 0;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.5rem;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-body {
      padding: 2rem;
    }

    .shipment-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-input,
    .form-select {
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.readonly {
      background: #f8f9fa;
      color: #6c757d;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 2rem;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
      border-radius: 0 0 15px 15px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-footer {
        flex-direction: column;
      }
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
export class DashboardComponent implements OnInit {
  showAddShipmentModal = false;
  newShipment = {
    trackingNumber: '',
    origin: '',
    destination: '',
    weight: 0,
    value: 0,
    carrier: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  };

  constructor(private supplyChainService: SupplyChainService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load initial data
  }

  openAddShipment(): void {
    this.showAddShipmentModal = true;
    this.generateTrackingNumber();
  }

  closeAddShipmentModal(): void {
    this.showAddShipmentModal = false;
    this.resetForm();
  }

  generateTrackingNumber(): void {
    const timestamp = Date.now().toString().slice(-6);
    this.newShipment.trackingNumber = `SC${timestamp}`;
  }

  resetForm(): void {
    this.newShipment = {
      trackingNumber: '',
      origin: '',
      destination: '',
      weight: 0,
      value: 0,
      carrier: '',
      priority: 'medium'
    };
  }

  saveShipment(): void {
    if (this.isFormValid()) {
      const shipmentData = {
        ...this.newShipment,
        status: 'pending' as const,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };
      
      this.supplyChainService.addShipment(shipmentData).subscribe(() => {
        this.closeAddShipmentModal();
        // Show success message
        alert('Shipment created successfully!');
      });
    }
  }

  isFormValid(): boolean {
    return !!(this.newShipment.origin && 
             this.newShipment.destination && 
             this.newShipment.carrier && 
             this.newShipment.weight > 0 && 
             this.newShipment.value > 0);
  }
}