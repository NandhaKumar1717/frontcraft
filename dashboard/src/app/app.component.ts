import { Component, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="shell-container">
      <!-- Premium Navigation Bar -->
      <nav class="navbar">
        <div class="nav-brand">
          <div class="logo">⚡</div>
          <div class="brand-text">
            <h2>NEXUS</h2>
            <span class="tagline">Enterprise Suite</span>
          </div>
        </div>
        <div class="nav-center">
          <div class="search-bar">
            <input type="text" placeholder="Search modules, reports, data..." />
            <button class="search-btn">🔍</button>
          </div>
        </div>
        <div class="nav-right">
          <div class="notifications">
            <span class="notification-icon">🔔</span>
            <span class="badge">3</span>
          </div>
          <div class="user-profile">
            <div class="user-details">
              <span class="user-name">John Smith</span>
              <span class="user-role">VP Operations</span>
            </div>
            <div class="user-avatar premium">JS</div>
          </div>
        </div>
      </nav>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-item">
          <span class="status-dot green"></span>
          <span>All Systems Operational</span>
        </div>
        <div class="status-item">
          <span>Last Updated: {{ getCurrentTime() }}</span>
        </div>
        <div class="status-item">
          <span>Active Users: 2,847</span>
        </div>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        @if (!currentApp) {
          <!-- Premium Dashboard -->
          <div class="dashboard-header">
            <div class="welcome-text">
              <h1>Good {{ getTimeOfDay() }}, John</h1>
              <p>Your enterprise command center is ready</p>
            </div>
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-value">$2.4M</div>
                <div class="stat-label">Revenue Today</div>
                <div class="stat-trend up">↗ +12%</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">98.7%</div>
                <div class="stat-label">System Uptime</div>
                <div class="stat-trend up">↗ +0.3%</div>
              </div>
            </div>
          </div>
          
          <div class="modules-grid">
            <div class="module-card premium" (click)="loadMicrofrontend('supply-chain')">
              <div class="card-header">
                <div class="module-icon supply-chain">🚛</div>
                <div class="module-status">
                  <span class="status-dot green"></span>
                  <span>Active</span>
                </div>
              </div>
              <div class="card-content">
                <h3>Global Supply Chain</h3>
                <p>AI-powered logistics optimization across 47 countries</p>
                <div class="module-metrics">
                  <span class="metric">10K+ Daily Transactions</span>
                  <span class="metric">40% Cost Reduction</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="launch-text">Launch Module →</span>
              </div>
            </div>
            
            <div class="module-card premium disabled">
              <div class="card-header">
                <div class="module-icon production">🏭</div>
                <div class="module-status">
                  <span class="status-dot green"></span>
                  <span>Active</span>
                </div>
              </div>
              <div class="card-content">
                <h3>Smart Manufacturing</h3>
                <p>IoT-enabled production monitoring with predictive analytics</p>
                <div class="module-metrics">
                  <span class="metric">5K+ Internal Users</span>
                  <span class="metric">60% Process Automation</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="launch-text">Launch Module →</span>
              </div>
            </div>
            
            <div class="module-card premium disabled">
              <div class="card-header">
                <div class="module-icon analytics">📊</div>
                <div class="module-status">
                  <span class="status-dot green"></span>
                  <span>Active</span>
                </div>
              </div>
              <div class="card-content">
                <h3>Advanced Analytics</h3>
                <p>Real-time business intelligence with machine learning insights</p>
                <div class="module-metrics">
                  <span class="metric">∞ Scalability</span>
                  <span class="metric">80% Faster Deployments</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="launch-text">Launch Module →</span>
              </div>
            </div>
            
            <div class="module-card premium disabled">
              <div class="card-header">
                <div class="module-icon workforce">👥</div>
                <div class="module-status">
                  <span class="status-dot green"></span>
                  <span>Active</span>
                </div>
              </div>
              <div class="card-content">
                <h3>Workforce Intelligence</h3>
                <p>AI-driven talent management and performance optimization</p>
                <div class="module-metrics">
                  <span class="metric">50K+ Employees</span>
                  <span class="metric">2K+ Daily Workflows</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="launch-text">Launch Module →</span>
              </div>
            </div>
          </div>
        } @else {
          <!-- Premium Module View -->
          <div class="module-header">
            <button class="back-btn premium" (click)="goHome()">
              ← Back to Command Center
            </button>
            <div class="module-title">
              <h2>{{ getModuleTitle(currentApp) }}</h2>
              <span class="module-subtitle">Enterprise Module</span>
            </div>
            <div class="module-actions">
              <button class="action-btn">⚙️ Settings</button>
              <button class="action-btn">📊 Analytics</button>
            </div>
          </div>
          <div class="module-content">
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading {{ currentApp }} module...</p>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    .shell-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: #ffffff;
    }
    
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logo {
      font-size: 2rem;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .brand-text h2 {
      color: #1a1a2e;
      font-weight: 700;
      font-size: 1.5rem;
      letter-spacing: -0.5px;
    }
    
    .tagline {
      color: #666;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .nav-center {
      flex: 1;
      max-width: 500px;
      margin: 0 2rem;
    }
    
    .search-bar {
      display: flex;
      background: #f8f9fa;
      border-radius: 25px;
      padding: 0.5rem 1rem;
      border: 2px solid transparent;
      transition: all 0.3s;
    }
    
    .search-bar:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .search-bar input {
      flex: 1;
      border: none;
      background: none;
      outline: none;
      font-size: 0.9rem;
      color: #333;
    }
    
    .search-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .nav-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    
    .notifications {
      position: relative;
      cursor: pointer;
    }
    
    .notification-icon {
      font-size: 1.2rem;
      color: #666;
    }
    
    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff4757;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
    }
    
    .user-details {
      text-align: right;
    }
    
    .user-name {
      color: #1a1a2e;
      font-weight: 600;
      font-size: 0.9rem;
      display: block;
    }
    
    .user-role {
      color: #666;
      font-size: 0.8rem;
    }
    
    .user-avatar.premium {
      width: 45px;
      height: 45px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .status-bar {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .status-dot.green {
      background: #2ed573;
      box-shadow: 0 0 10px rgba(46, 213, 115, 0.5);
    }
    
    .main-content {
      padding: 3rem 2rem;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }
    
    .welcome-text h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #ffffff, #a8b2ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .welcome-text p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.1rem;
    }
    
    .quick-stats {
      display: flex;
      gap: 2rem;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      padding: 1.5rem;
      border-radius: 15px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2ed573;
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }
    
    .stat-trend.up {
      color: #2ed573;
      font-weight: 600;
    }
    
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }
    
    .module-card.premium {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .module-card.premium:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .module-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .module-card.disabled:hover {
      transform: none;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .module-icon {
      width: 60px;
      height: 60px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
    }
    
    .module-icon.supply-chain {
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    }
    
    .module-icon.production {
      background: linear-gradient(45deg, #4834d4, #686de0);
    }
    
    .module-icon.analytics {
      background: linear-gradient(45deg, #00d2d3, #54a0ff);
    }
    
    .module-icon.workforce {
      background: linear-gradient(45deg, #5f27cd, #a55eea);
    }
    
    .module-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #2ed573;
      font-weight: 600;
    }
    
    .card-content h3 {
      color: #1a1a2e;
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .card-content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    .module-metrics {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    
    .metric {
      font-size: 0.8rem;
      color: #888;
      font-weight: 500;
    }
    
    .card-footer {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    
    .launch-text {
      color: #667eea;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .module-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      padding: 2rem;
      border-radius: 20px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .back-btn.premium {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .back-btn.premium:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
    
    .module-title h2 {
      font-size: 1.8rem;
      font-weight: 700;
    }
    
    .module-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }
    
    .module-actions {
      display: flex;
      gap: 1rem;
    }
    
    .action-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .module-content {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 3rem;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .loading-state {
      text-align: center;
      color: #666;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AppComponent implements OnInit {
  currentApp: string = '';

  ngOnInit(): void {
    // Listen for messages from child apps
    window.addEventListener('message', (event) => {
      if (event.data.action === 'navigate-home') {
        this.goHome();
      }
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }

  getModuleTitle(appName: string): string {
    const titles: { [key: string]: string } = {
      'supply-chain': 'Global Supply Chain',
      'production': 'Smart Manufacturing',
      'analytics': 'Advanced Analytics',
      'workforce': 'Workforce Intelligence'
    };
    return titles[appName] || appName;
  }

  async loadMicrofrontend(appName: string) {
    try {
      console.log(`Loading ${appName}...`);
      
      const module = await loadRemoteModule({
        type: 'module',
        remoteEntry: environment.remotes.supplyChain,
        exposedModule: './Module'
      });
      
      this.currentApp = appName;
      console.log(`✅ ${appName} loaded successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to load ${appName}:`, error);
    }
  }
  
  goHome() {
    this.currentApp = '';
  }
}
