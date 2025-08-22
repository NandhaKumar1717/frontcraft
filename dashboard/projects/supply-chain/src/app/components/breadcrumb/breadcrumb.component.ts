import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="breadcrumb-container">
      <nav class="breadcrumb">
        <a href="#" class="breadcrumb-item home" (click)="goHome($event)">
          🏠 Home
        </a>
        <span class="separator">></span>
        <span class="breadcrumb-item current">Dashboard</span>
      </nav>
    </div>
  `,
  styles: [`
    .breadcrumb-container {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 0.8rem 2rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .breadcrumb-item {
      color: #666;
      text-decoration: none;
      transition: color 0.3s;
    }

    .breadcrumb-item.home:hover {
      color: #667eea;
    }

    .breadcrumb-item.current {
      color: #2c3e50;
      font-weight: 600;
    }

    .separator {
      color: #999;
      margin: 0 0.5rem;
    }
  `]
})
export class BreadcrumbComponent {
  goHome(event: Event): void {
    event.preventDefault();
    // Try multiple methods to navigate back to home
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ action: 'navigate-home' }, '*');
      } else {
        // Fallback: navigate to shell app directly
        window.location.href = 'http://localhost:4200';
      }
    } catch (error) {
      console.log('Navigation fallback');
      window.location.href = 'http://localhost:4200';
    }
  }
}