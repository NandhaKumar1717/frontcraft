import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Reports</h1>
      <div class="grid">
        <div class="card">
          <h3>Available Reports</h3>
          <div class="report" *ngFor="let report of reports">
            <span>{{ report.name }}</span>
            <button (click)="generateReport(report.id)">Generate</button>
          </div>
        </div>
        <div class="card">
          <h3>Recent Reports</h3>
          <div class="recent" *ngFor="let recent of recentReports">
            <span>{{ recent.name }}</span>
            <span>{{ recent.date }}</span>
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
    .report, .recent { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
    button { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #2563eb; }
  `]
})
export class ReportsComponent {
  reports = [
    { id: 1, name: 'Monthly Shipment Report' },
    { id: 2, name: 'Carrier Performance Report' },
    { id: 3, name: 'Cost Analysis Report' }
  ];

  recentReports = [
    { name: 'Weekly Summary', date: '2024-01-15' },
    { name: 'Q4 Analysis', date: '2024-01-10' },
    { name: 'Carrier Review', date: '2024-01-08' }
  ];

  generateReport(id: number): void {
    console.log('Generating report:', id);
    alert('Report generated successfully!');
  }
}