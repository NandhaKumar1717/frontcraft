import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="shell-container">
      <nav class="navbar">
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
            <h1>Dashboard</h1>
            <p>Enterprise command center</p>
          </div>
          
          <div class="modules-grid">
            <div class="module-card" (click)="loadMicrofrontend('supply-chain')">
              <div class="module-icon">SC</div>
              <h3>Global Supply Chain</h3>
              <p>Logistics management system</p>
            </div>
            
            <div class="module-card disabled">
              <div class="module-icon">MF</div>
              <h3>Smart Manufacturing</h3>
              <p>Production monitoring</p>
            </div>
            
            <div class="module-card disabled">
              <div class="module-icon">AN</div>
              <h3>Advanced Analytics</h3>
              <p>Business intelligence</p>
            </div>
          </div>
        } @else {
          <div class="module-header">
            <button class="back-btn" (click)="goHome()">← Back</button>
            <h2>{{ getModuleTitle(currentApp) }}</h2>
          </div>
          <div class="module-content">
            <router-outlet></router-outlet>
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
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-header h1 {
      color: #2c3e50;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .dashboard-header p {
      color: #666;
    }
    
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .module-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .module-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    .module-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    
    .module-icon {
      width: 60px;
      height: 60px;
      background: #667eea;
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    
    .module-card h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .module-card p {
      color: #666;
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
    }
  `]
})
export class AppComponent implements OnInit {
  currentApp: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check current route
    this.route.url.subscribe(segments => {
      if (segments.length > 0) {
        this.currentApp = segments[0].path;
      }
    });

    window.addEventListener('message', (event) => {
      if (event.data.action === 'navigate-home') {
        this.goHome();
      }
    });
  }

  getModuleTitle(appName: string): string {
    const titles: { [key: string]: string } = {
      'supply-chain': 'Global Supply Chain'
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
      
      // Navigate to the app route
      this.router.navigate([appName]);
      console.log(`✅ ${appName} loaded successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to load ${appName}:`, error);
    }
  }
  
  goHome() {
    this.router.navigate(['/']);
  }
}