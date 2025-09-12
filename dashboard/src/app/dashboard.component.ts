import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shell-container">
      <nav class="navbar" *ngIf="!currentApp">
        <div class="nav-brand">
          <div class="logo">N</div>
          <div class="brand-text">
            <h2>NEXUS</h2>
            <span>Enterprise Suite</span>
          </div>
        </div>
        <div class="nav-right">
          <div class="user-profile">
            <span class="user-name">John Smith</span>
            <div class="user-avatar">JS</div>
          </div>
        </div>
      </nav>

      <main class="main-content">
        @if (!currentApp) {
          <div class="dashboard-header">
            <div class="header-content">
              <h1>Dashboard</h1>
              <p>Enterprise command center</p>
            </div>
            <div class="header-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.activeUsers }}</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.revenue }}</span>
                <span class="stat-label">Revenue</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.orders }}</span>
                <span class="stat-label">Orders</span>
              </div>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header">
                <h3>Dashboard Metrics</h3>
                <span class="trend up">+12.5%</span>
              </div>
              <div class="metric-value">2,847</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-header">
                <h3>Active Orders</h3>
                <span class="trend up">+8.2%</span>
              </div>
              <div class="metric-value">156</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-header">
                <h3>System Health</h3>
                <span class="trend stable">99.9%</span>
              </div>
              <div class="metric-value">Optimal</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-header">
                <h3>Notifications</h3>
                <span class="badge">{{ notifications.length }}</span>
              </div>
              <div class="notification-list">
                <div class="notification-item" *ngFor="let notif of notifications.slice(0,3)">
                  <span class="notif-text">{{ notif.message }}</span>
                  <span class="notif-time">{{ notif.time }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modules-grid">
            <div class="module-card" (click)="loadMicrofrontend('supply-chain')">
              <h3>Global Supply Chain</h3>
              <p>Logistics management system</p>
              <div class="module-status active">Active</div>
            </div>
            
            <div class="module-card" (click)="showComingSoon('manufacturing')">
              <h3>Smart Manufacturing</h3>
              <p>Production monitoring</p>
              <div class="module-status coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card" (click)="showComingSoon('analytics')">
              <h3>Advanced Analytics</h3>
              <p>Business intelligence</p>
              <div class="module-status coming-soon">Coming Soon</div>
            </div>
          </div>
        } @else {
          <div class="microfrontend-wrapper">
            <div class="microfrontend-header">
              <button class="back-btn" (click)="goHome()">← Back to Dashboard</button>
            </div>
            @if (isLoading) {
              <div class="loading">Loading {{ currentApp }}...</div>
            } @else {
              <div id="microfrontend-container"></div>
            }
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .shell-container {
      font-family: system-ui, sans-serif;
      min-height: 100vh;
      background: #f8f9fa;
    }
    
    .navbar {
      background: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logo {
      font-size: 2rem;
      color: #667eea;
    }
    
    .brand-text h2 {
      color: #2c3e50;
      font-weight: 700;
      margin: 0;
    }
    
    .brand-text span {
      color: #666;
      font-size: 0.8rem;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-name {
      color: #2c3e50;
      font-weight: 600;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    
    .main-content {
      padding: 2rem;
    }
    
    .microfrontend-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: white;
      z-index: 1000;
    }
    
    .microfrontend-header {
      background: white;
      padding: 1rem 2rem;
      border-bottom: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-content h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    
    .header-content p {
      opacity: 0.9;
      font-size: 1.1rem;
    }
    
    .header-stats {
      display: flex;
      gap: 2rem;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      display: block;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s;
      position: relative;
    }
    
    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
    }
    
    .metric-card h3 {
      color: #2c3e50;
      font-size: 1rem;
      margin: 0.5rem 0;
      font-weight: 600;
    }
    
    .metric-desc {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0 0 0;
    }
    
    .trend {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .trend.up {
      background: #d4edda;
      color: #155724;
    }
    
    .trend.stable {
      background: #cce7ff;
      color: #004085;
    }
    
    .badge {
      background: #ff6b6b;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }
    
    .metric-chart {
      font-size: 1.5rem;
      text-align: right;
    }
    
    .notification-list {
      margin-top: 0.5rem;
    }
    
    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.9rem;
    }
    
    .notification-item:last-child {
      border-bottom: none;
    }
    
    .notif-text {
      color: #2c3e50;
      flex: 1;
    }
    
    .notif-time {
      color: #666;
      font-size: 0.8rem;
    }
    
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .module-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }
    
    .module-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .module-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
      border-color: #667eea;
    }
    
    .module-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .module-card h3 {
      color: #2c3e50;
      margin-bottom: 0.8rem;
      font-size: 1.3rem;
      font-weight: 600;
    }
    
    .module-card p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .module-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .module-status.active {
      background: #d4edda;
      color: #155724;
    }
    
    .module-status.coming-soon {
      background: #fff3cd;
      color: #856404;
    }
    
    .module-header {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .back-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .module-header h2 {
      color: #2c3e50;
      margin: 0;
    }
    
    .module-content {
      background: white;
      border-radius: 12px;
      padding: 3rem;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .loading {
      color: #666;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .loading::before {
      content: '';
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .achievements-section {
      margin: 3rem 0;
    }
    
    .achievements-section h2 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    .achievement-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }
    
    .achievement-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s;
      border-top: 4px solid #667eea;
    }
    
    .achievement-card:hover {
      transform: translateY(-5px);
    }
    
    .achievement-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .achievement-card h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    
    .achievement-card ul {
      list-style: none;
      padding: 0;
      margin-bottom: 1.5rem;
    }
    
    .achievement-card li {
      padding: 0.3rem 0;
      color: #555;
      position: relative;
      padding-left: 1.5rem;
    }
    
    .achievement-card li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }
    
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tech-tag {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
      
      .header-stats {
        justify-content: center;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .modules-grid {
        grid-template-columns: 1fr;
      }
      
      .achievement-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentApp: string = '';
  isLoading: boolean = false;
  
  constructor(private router: Router) {}
  
  stats = {
    activeUsers: '2,847',
    revenue: '$45.2K',
    orders: '156'
  };
  
  notifications = [
    { message: 'New order received', time: '2m ago', type: 'info' },
    { message: 'Low stock alert', time: '15m ago', type: 'warning' },
    { message: 'Report generated', time: '1h ago', type: 'success' },
    { message: 'System backup completed', time: '2h ago', type: 'info' }
  ];

  ngOnInit(): void {
    // Check URL on load
    const path = window.location.pathname;
    if (path.startsWith('/supply-chain')) {
      this.loadMicrofrontend('supply-chain');
    }
  }

  getModuleTitle(appName: string): string {
    const titles: { [key: string]: string } = {
      'supply-chain': 'Global Supply Chain'
    };
    return titles[appName] || appName;
  }

  loadMicrofrontend(appName: string) {
    // Navigate to separate supply chain app
    const targetUrl = environment.production 
      ? 'https://nandhakumar1717.github.io/frontcraft/supply-chain/'
      : 'http://localhost:4201';
    
    window.location.href = targetUrl;
  }
  
  goHome() {
    this.currentApp = '';
    this.isLoading = false;
    
    // Navigate to dashboard root without adding /dashboard
    window.history.pushState({}, '', '/frontcraft/dashboard/');
    
    const container = document.getElementById('microfrontend-container');
    if (container) {
      container.innerHTML = '';
    }
  }
  
  showComingSoon(module: string) {
    alert(`${module} module is coming soon!`);
  }
}