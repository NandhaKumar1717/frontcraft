import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ChartsComponent],
  template: `
    <div class="analytics-page">
      <div class="page-header">
        <div class="header-content">
          <h1>📊 Supply Chain Analytics</h1>
          <p>Advanced analytics and insights for supply chain optimization</p>
        </div>
        <div class="header-actions">
          <select class="time-filter">
            <option value="7d">Last 7 Days</option>
            <option value="30d" selected>Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button class="btn-primary" (click)="exportReport()">
            📊 Export Report
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let kpi of kpiData">
          <div class="kpi-icon">{{ kpi.icon }}</div>
          <div class="kpi-content">
            <h3>{{ kpi.value }}</h3>
            <p>{{ kpi.label }}</p>
            <span class="kpi-change" [ngClass]="kpi.trend">
              {{ kpi.change }}
            </span>
          </div>
        </div>
      </div>

      <app-charts></app-charts>

      <div class="analytics-grid">
        <div class="analytics-card">
          <h3>Route Performance</h3>
          <div class="route-list">
            <div class="route-item" *ngFor="let route of routePerformance">
              <div class="route-info">
                <strong>{{ route.from }} → {{ route.to }}</strong>
                <span class="route-stats">{{ route.shipments }} shipments</span>
              </div>
              <div class="route-metrics">
                <span class="metric success">{{ route.onTime }}% On-Time</span>
                <span class="metric">{{ route.avgDays }} days avg</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Carrier Performance</h3>
          <div class="carrier-list">
            <div class="carrier-item" *ngFor="let carrier of carrierPerformance">
              <div class="carrier-info">
                <strong>{{ carrier.name }}</strong>
                <span class="carrier-volume">{{ carrier.volume }} shipments</span>
              </div>
              <div class="performance-bar">
                <div class="bar-fill" [style.width.%]="carrier.rating"></div>
                <span class="rating">{{ carrier.rating }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Cost Analysis</h3>
          <div class="cost-breakdown">
            <div class="cost-item" *ngFor="let cost of costBreakdown">
              <div class="cost-label">{{ cost.category }}</div>
              <div class="cost-bar">
                <div class="cost-fill" [style.width.%]="cost.percentage"></div>
              </div>
              <div class="cost-amount">\${{ cost.amount }}K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page {
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
      align-items: center;
    }

    .time-filter {
      padding: 0.8rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      background: white;
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

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .kpi-icon {
      font-size: 3rem;
      opacity: 0.8;
    }

    .kpi-content h3 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
    }

    .kpi-content p {
      margin: 0.5rem 0;
      color: #666;
    }

    .kpi-change {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
    }

    .kpi-change.up {
      background: #d4edda;
      color: #155724;
    }

    .kpi-change.down {
      background: #f8d7da;
      color: #721c24;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .analytics-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .analytics-card h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .route-item, .carrier-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .route-info, .carrier-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .route-stats, .carrier-volume {
      font-size: 0.8rem;
      color: #666;
    }

    .route-metrics {
      display: flex;
      gap: 1rem;
    }

    .metric {
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      background: #f8f9fa;
    }

    .metric.success {
      background: #d4edda;
      color: #155724;
    }

    .performance-bar {
      position: relative;
      width: 120px;
      height: 20px;
      background: #f1f3f4;
      border-radius: 10px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(45deg, #27ae60, #2ecc71);
      transition: width 0.3s;
    }

    .rating {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.7rem;
      font-weight: 600;
      color: white;
    }

    .cost-item {
      display: grid;
      grid-template-columns: 1fr 2fr 80px;
      gap: 1rem;
      align-items: center;
      padding: 0.8rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .cost-bar {
      height: 8px;
      background: #f1f3f4;
      border-radius: 4px;
      overflow: hidden;
    }

    .cost-fill {
      height: 100%;
      background: linear-gradient(45deg, #3498db, #2980b9);
    }

    .cost-amount {
      text-align: right;
      font-weight: 600;
      color: #2c3e50;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  kpiData = [
    { icon: '📈', value: '94.2%', label: 'On-Time Delivery', change: '+2.1%', trend: 'up' },
    { icon: '💰', value: '$2.4M', label: 'Cost Savings', change: '+18%', trend: 'up' },
    { icon: '⚡', value: '3.2 days', label: 'Avg Transit Time', change: '-0.5 days', trend: 'up' },
    { icon: '🎯', value: '98.7%', label: 'Accuracy Rate', change: '+1.2%', trend: 'up' }
  ];

  routePerformance = [
    { from: 'Shanghai', to: 'Los Angeles', shipments: 156, onTime: 96, avgDays: 14 },
    { from: 'Rotterdam', to: 'New York', shipments: 134, onTime: 94, avgDays: 12 },
    { from: 'Singapore', to: 'Sydney', shipments: 89, onTime: 98, avgDays: 8 },
    { from: 'Hamburg', to: 'Montreal', shipments: 67, onTime: 92, avgDays: 16 }
  ];

  carrierPerformance = [
    { name: 'DHL Express', volume: 245, rating: 96 },
    { name: 'FedEx', volume: 198, rating: 94 },
    { name: 'UPS', volume: 167, rating: 92 },
    { name: 'Maersk', volume: 134, rating: 89 }
  ];

  costBreakdown = [
    { category: 'Transportation', amount: 1240, percentage: 45 },
    { category: 'Warehousing', amount: 680, percentage: 25 },
    { category: 'Customs & Duties', amount: 410, percentage: 15 },
    { category: 'Insurance', amount: 275, percentage: 10 },
    { category: 'Other', amount: 135, percentage: 5 }
  ];

  ngOnInit(): void {}

  exportReport(): void {
    console.log('Exporting analytics report...');
  }
}