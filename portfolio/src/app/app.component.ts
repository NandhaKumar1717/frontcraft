import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated = true;
  
  currentUser = {
    name: 'John Doe',
    role: 'Admin',
    lastLogin: new Date('2025-01-02T10:30:00')
  };

  microFrontends = [
    {
      name: 'Dashboard',
      description: 'Main analytics and overview dashboard',
      icon: '📊',
      status: 'active',
      version: '1.2.0',
      route: '/dashboard'
    },
    {
      name: 'Supply Chain',
      description: 'Inventory and order management system',
      icon: '🚚',
      status: 'active',
      version: '1.1.0',
      route: '/supply-chain'
    },
    {
      name: 'Reports',
      description: 'Business intelligence and reporting',
      icon: '📈',
      status: 'maintenance',
      version: '1.0.5',
      route: '/reports'
    }
  ];

  dashboardMetrics = {
    totalUsers: '2,847',
    revenue: '$45,230'
  };

  supplyChainMetrics = {
    orders: '23',
    inventory: '8'
  };

  recentReports = [
    { name: 'Monthly Sales', date: new Date('2025-01-01') },
    { name: 'Inventory Report', date: new Date('2024-12-30') },
    { name: 'User Analytics', date: new Date('2024-12-28') }
  ];

  ngOnInit() {
    // Initialize component
  }

  login() {
    this.isAuthenticated = true;
    this.currentUser = {
      name: 'John Doe',
      role: 'Admin',
      lastLogin: new Date()
    };
  }

  logout() {
    this.isAuthenticated = false;
  }

  launchMFE(route: string) {
    window.location.href = `https://nandhakumar1717.github.io/frontcraft${route}`;
  }
}