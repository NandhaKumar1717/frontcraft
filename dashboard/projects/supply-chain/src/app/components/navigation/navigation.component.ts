import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <div class="app-logo">SC</div>
        <div class="app-name">
          <h2>Supply Chain Pro</h2>
        </div>
      </div>
      
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
        <a routerLink="/shipments" routerLinkActive="active" class="nav-link">Shipments</a>
        <a routerLink="/analytics" routerLinkActive="active" class="nav-link">Analytics</a>
        <a routerLink="/reports" routerLinkActive="active" class="nav-link">Reports</a>
      </div>
      
      <div class="nav-actions">
        <div class="user-menu">
          <span class="user-name">John Smith</span>
          <div class="user-avatar">JS</div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      color: white;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .app-logo {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem;
      border-radius: 10px;
    }

    .app-name h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s;
      font-weight: 500;
    }

    .nav-link:hover,
    .nav-link.active {
      color: white;
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-actions {
      display: flex;
      align-items: center;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-weight: 500;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
  `]
})
export class NavigationComponent {
  constructor(private router: Router) {}
}