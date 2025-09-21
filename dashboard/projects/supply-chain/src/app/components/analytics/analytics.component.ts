import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Analytics</h1>
      <div class="grid">
        <div class="card">
          <h3>Performance Metrics</h3>
          <div class="metric" *ngFor="let metric of metrics">
            <span>{{ metric.label }}</span>
            <span>{{ metric.value }}</span>
          </div>
        </div>
        <div class="card">
          <h3>Route Analysis</h3>
          <div class="route" *ngFor="let route of routes">
            <span>{{ route.name }}</span>
            <span>{{ route.performance }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; font-family: 'Montserrat', sans-serif; }
    h1 { font-size: 2rem; font-weight: 600; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
    .metric, .route { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
  `]
})
export class AnalyticsComponent {
  metrics = [
    { label: 'On-Time Delivery', value: '94.2%' },
    { label: 'Cost Efficiency', value: '87.5%' },
    { label: 'Transit Time', value: '8.2 days' }
  ];

  routes = [
    { name: 'Asia-Pacific', performance: 96 },
    { name: 'Europe', performance: 92 },
    { name: 'North America', performance: 89 }
  ];
}