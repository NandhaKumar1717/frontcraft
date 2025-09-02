import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page">
      <div class="page-header">
        <div class="header-content">
          <h1>📋 Reports & Documentation</h1>
          <p>Generate and manage supply chain reports and compliance documents</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="generateReport()">
            📊 Generate Report
          </button>
          <button class="btn-secondary" (click)="scheduleReport()">
            ⏰ Schedule Report
          </button>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-category">
          <h3>📈 Performance Reports</h3>
          <div class="report-list">
            <div class="report-item" *ngFor="let report of performanceReports">
              <div class="report-info">
                <h4>{{ report.name }}</h4>
                <p>{{ report.description }}</p>
                <span class="report-meta">Last generated: {{ report.lastGenerated }}</span>
              </div>
              <div class="report-actions">
                <button class="btn-action" (click)="viewReport(report)">👁️ View</button>
                <button class="btn-action" (click)="downloadReport(report)">⬇️ Download</button>
              </div>
            </div>
          </div>
        </div>

        <div class="report-category">
          <h3>💰 Financial Reports</h3>
          <div class="report-list">
            <div class="report-item" *ngFor="let report of financialReports">
              <div class="report-info">
                <h4>{{ report.name }}</h4>
                <p>{{ report.description }}</p>
                <span class="report-meta">Last generated: {{ report.lastGenerated }}</span>
              </div>
              <div class="report-actions">
                <button class="btn-action" (click)="viewReport(report)">👁️ View</button>
                <button class="btn-action" (click)="downloadReport(report)">⬇️ Download</button>
              </div>
            </div>
          </div>
        </div>

        <div class="report-category">
          <h3>📋 Compliance Reports</h3>
          <div class="report-list">
            <div class="report-item" *ngFor="let report of complianceReports">
              <div class="report-info">
                <h4>{{ report.name }}</h4>
                <p>{{ report.description }}</p>
                <span class="report-meta">Last generated: {{ report.lastGenerated }}</span>
              </div>
              <div class="report-actions">
                <button class="btn-action" (click)="viewReport(report)">👁️ View</button>
                <button class="btn-action" (click)="downloadReport(report)">⬇️ Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="scheduled-reports">
        <h3>⏰ Scheduled Reports</h3>
        <div class="schedule-list">
          <div class="schedule-item" *ngFor="let schedule of scheduledReports">
            <div class="schedule-info">
              <h4>{{ schedule.reportName }}</h4>
              <p>{{ schedule.frequency }} • Next: {{ schedule.nextRun }}</p>
            </div>
            <div class="schedule-status">
              <span class="status-badge" [ngClass]="schedule.status">{{ schedule.status }}</span>
              <button class="btn-small" (click)="editSchedule(schedule)">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <div class="report-templates">
        <h3>📄 Report Templates</h3>
        <div class="template-grid">
          <div class="template-card" *ngFor="let template of reportTemplates">
            <div class="template-icon">{{ template.icon }}</div>
            <h4>{{ template.name }}</h4>
            <p>{{ template.description }}</p>
            <button class="btn-template" (click)="useTemplate(template)">Use Template</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
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

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .report-category {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .report-category h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
    }

    .report-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .report-item:last-child {
      border-bottom: none;
    }

    .report-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .report-info p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .report-meta {
      font-size: 0.8rem;
      color: #999;
    }

    .report-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s;
    }

    .btn-action:hover {
      background: #e9ecef;
    }

    .scheduled-reports {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .scheduled-reports h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .schedule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .schedule-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .schedule-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .schedule-status {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.paused {
      background: #fff3cd;
      color: #856404;
    }

    .btn-small {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .report-templates {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .report-templates h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .template-card {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      transition: all 0.3s;
    }

    .template-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .template-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .template-card h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .template-card p {
      margin: 0 0 1.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .btn-template {
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-template:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
    }
  `]
})
export class ReportsComponent implements OnInit {
  performanceReports = [
    {
      name: 'Monthly Performance Summary',
      description: 'Comprehensive overview of supply chain performance metrics',
      lastGenerated: '2024-08-20'
    },
    {
      name: 'On-Time Delivery Report',
      description: 'Analysis of delivery performance across all routes',
      lastGenerated: '2024-08-19'
    },
    {
      name: 'Carrier Performance Analysis',
      description: 'Detailed evaluation of carrier efficiency and reliability',
      lastGenerated: '2024-08-18'
    }
  ];

  financialReports = [
    {
      name: 'Cost Analysis Report',
      description: 'Breakdown of supply chain costs and optimization opportunities',
      lastGenerated: '2024-08-20'
    },
    {
      name: 'Revenue Impact Analysis',
      description: 'Analysis of supply chain impact on revenue generation',
      lastGenerated: '2024-08-17'
    }
  ];

  complianceReports = [
    {
      name: 'Customs Compliance Report',
      description: 'Documentation of customs and regulatory compliance',
      lastGenerated: '2024-08-19'
    },
    {
      name: 'Safety & Security Audit',
      description: 'Supply chain safety and security compliance assessment',
      lastGenerated: '2024-08-15'
    }
  ];

  scheduledReports = [
    {
      reportName: 'Weekly Performance Summary',
      frequency: 'Weekly',
      nextRun: '2024-08-26',
      status: 'active'
    },
    {
      reportName: 'Monthly Financial Report',
      frequency: 'Monthly',
      nextRun: '2024-09-01',
      status: 'active'
    },
    {
      reportName: 'Quarterly Compliance Audit',
      frequency: 'Quarterly',
      nextRun: '2024-10-01',
      status: 'paused'
    }
  ];

  reportTemplates = [
    {
      icon: '📊',
      name: 'Performance Dashboard',
      description: 'Interactive performance metrics and KPIs'
    },
    {
      icon: '💰',
      name: 'Cost Analysis',
      description: 'Detailed cost breakdown and optimization'
    },
    {
      icon: '🚛',
      name: 'Shipment Tracking',
      description: 'Real-time shipment status and tracking'
    },
    {
      icon: '📋',
      name: 'Compliance Checklist',
      description: 'Regulatory compliance verification'
    }
  ];

  ngOnInit(): void {}

  generateReport(): void {
    console.log('Generating new report...');
  }

  scheduleReport(): void {
    console.log('Scheduling report...');
  }

  viewReport(report: any): void {
    console.log('Viewing report:', report.name);
  }

  downloadReport(report: any): void {
    console.log('Downloading report:', report.name);
  }

  editSchedule(schedule: any): void {
    console.log('Editing schedule:', schedule.reportName);
  }

  useTemplate(template: any): void {
    console.log('Using template:', template.name);
  }
}