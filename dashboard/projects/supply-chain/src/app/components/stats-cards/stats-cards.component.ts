import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplyChainService } from '../../services/supply-chain.service';
import { ShipmentStats } from '../../models/shipment.model';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="stat-card total">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>{{ stats?.totalShipments || 0 }}</h3>
          <p>Total Shipments</p>
          <span class="trend up">+12% from last month</span>
        </div>
      </div>

      <div class="stat-card in-transit">
        <div class="stat-icon">🚛</div>
        <div class="stat-content">
          <h3>{{ stats?.inTransit || 0 }}</h3>
          <p>In Transit</p>
          <span class="trend up">+8% from last week</span>
        </div>
      </div>

      <div class="stat-card delivered">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ stats?.delivered || 0 }}</h3>
          <p>Delivered</p>
          <span class="trend up">+15% from last month</span>
        </div>
      </div>

      <div class="stat-card performance">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>{{ stats?.onTimeDeliveryRate || 0 }}%</h3>
          <p>On-Time Delivery</p>
          <span class="trend up">+2.1% from last month</span>
        </div>
      </div>

      <div class="stat-card value">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>\${{ formatCurrency(stats?.totalValue || 0) }}</h3>
          <p>Total Value</p>
          <span class="trend up">+18% from last month</span>
        </div>
      </div>

      <div class="stat-card delayed">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <h3>{{ stats?.delayed || 0 }}</h3>
          <p>Delayed</p>
          <span class="trend down">-5% from last week</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
      border-left: 4px solid;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }

    .stat-card.total { border-left-color: #3498db; }
    .stat-card.in-transit { border-left-color: #f39c12; }
    .stat-card.delivered { border-left-color: #27ae60; }
    .stat-card.performance { border-left-color: #9b59b6; }
    .stat-card.value { border-left-color: #e74c3c; }
    .stat-card.delayed { border-left-color: #e67e22; }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
    }

    .stat-content p {
      color: #7f8c8d;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .trend {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .trend.up {
      color: #27ae60;
      background: rgba(39, 174, 96, 0.1);
    }

    .trend.down {
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
    }
  `]
})
export class StatsCardsComponent implements OnInit {
  stats: ShipmentStats | null = null;

  constructor(private supplyChainService: SupplyChainService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.supplyChainService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }
}