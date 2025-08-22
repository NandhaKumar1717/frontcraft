import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="charts-container">
      <div class="chart-card">
        <h3>Shipment Status Distribution</h3>
        <div class="chart-wrapper">
          <div class="pie-chart">
            <div class="chart-center">
              <span class="total-label">Total<br><strong>{{ getTotalShipments() }}</strong></span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item delivered">
              <span class="legend-color"></span>
              <span>Delivered ({{ chartData.delivered }}%)</span>
            </div>
            <div class="legend-item in-transit">
              <span class="legend-color"></span>
              <span>In Transit ({{ chartData.inTransit }}%)</span>
            </div>
            <div class="legend-item pending">
              <span class="legend-color"></span>
              <span>Pending ({{ chartData.pending }}%)</span>
            </div>
            <div class="legend-item delayed">
              <span class="legend-color"></span>
              <span>Delayed ({{ chartData.delayed }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>Monthly Performance</h3>
        <div class="bar-chart">
          <div class="bar-item" *ngFor="let item of monthlyData">
            <div class="bar" [style.height.%]="item.percentage">
              <span class="bar-value">{{ item.value }}</span>
            </div>
            <span class="bar-label">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <div class="chart-card full-width">
        <h3>Real-time Metrics</h3>
        <div class="metrics-grid">
          <div class="metric-item" *ngFor="let metric of realTimeMetrics">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-content">
              <h4>{{ metric.value }}</h4>
              <p>{{ metric.label }}</p>
              <span class="metric-trend" [ngClass]="metric.trend">
                {{ metric.change }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .chart-card.full-width {
      grid-column: 1 / -1;
    }

    .chart-card h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    .chart-wrapper {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .pie-chart {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        #27ae60 0% 45%,
        #f39c12 45% 75%,
        #3498db 75% 90%,
        #e74c3c 90% 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-center {
      position: absolute;
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 0.9rem;
      color: #2c3e50;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .legend-item.delivered .legend-color { background: #27ae60; }
    .legend-item.in-transit .legend-color { background: #f39c12; }
    .legend-item.pending .legend-color { background: #3498db; }
    .legend-item.delayed .legend-color { background: #e74c3c; }

    .bar-chart {
      display: flex;
      align-items: end;
      gap: 1rem;
      height: 200px;
      padding: 1rem 0;
    }

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .bar {
      width: 100%;
      background: linear-gradient(45deg, #3498db, #2980b9);
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: end;
      justify-content: center;
      padding: 0.5rem;
      color: white;
      font-weight: 600;
      font-size: 0.8rem;
      transition: all 0.3s;
      position: relative;
    }

    .bar:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
    }

    .bar-label {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #666;
      font-weight: 600;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .metric-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      border-left: 4px solid #3498db;
      transition: all 0.3s;
    }

    .metric-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }

    .metric-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .metric-content h4 {
      margin: 0;
      font-size: 1.8rem;
      color: #2c3e50;
      font-weight: 700;
    }

    .metric-content p {
      margin: 0.25rem 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .metric-trend {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
    }

    .metric-trend.up {
      background: #d4edda;
      color: #155724;
    }

    .metric-trend.down {
      background: #f8d7da;
      color: #721c24;
    }
  `]
})
export class ChartsComponent implements OnInit {
  chartData = {
    delivered: 45,
    inTransit: 30,
    pending: 15,
    delayed: 10
  };

  monthlyData = [
    { month: 'Jan', value: 1250, percentage: 80 },
    { month: 'Feb', value: 1380, percentage: 90 },
    { month: 'Mar', value: 1120, percentage: 70 },
    { month: 'Apr', value: 1450, percentage: 95 },
    { month: 'May', value: 1680, percentage: 100 },
    { month: 'Jun', value: 1520, percentage: 85 }
  ];

  realTimeMetrics = [
    { icon: '🚛', value: '247', label: 'Active Trucks', change: '+12%', trend: 'up' },
    { icon: '⏱️', value: '94.2%', label: 'On-Time Rate', change: '+2.1%', trend: 'up' },
    { icon: '💰', value: '$2.4M', label: 'Revenue Today', change: '+18%', trend: 'up' },
    { icon: '⚠️', value: '3', label: 'Active Alerts', change: '-5', trend: 'down' },
    { icon: '📦', value: '1,247', label: 'Total Shipments', change: '+8%', trend: 'up' },
    { icon: '🌍', value: '47', label: 'Countries', change: '+2', trend: 'up' }
  ];

  ngOnInit(): void {
    // Remove setInterval to avoid Zone.js issues
  }

  getTotalShipments(): number {
    return 1247;
  }

  private updateRealTimeData(): void {
    this.realTimeMetrics[0].value = (240 + Math.floor(Math.random() * 20)).toString();
    this.realTimeMetrics[2].value = `$${(2.2 + Math.random() * 0.4).toFixed(1)}M`;
    this.realTimeMetrics[3].value = Math.floor(Math.random() * 8).toString();
  }
}