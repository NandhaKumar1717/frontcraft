import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../environment/environment';

/**
 * Dashboard Component
 * Main landing page for the Nexus microfrontend platform
 * Provides navigation to different applications and user management
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // User menu state
  showUserMenu: boolean = false;
  
  // User information
  userName: string = 'Nandha Kumar';
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization logic can be added here
  }

  /**
   * Allows user to edit their display name
   * Opens a prompt dialog for name input
   */
  editUserName(): void {
    const newName = prompt('Enter your name:', this.userName);
    if (newName && newName.trim()) {
      this.userName = newName.trim();
    }
  }

  /**
   * Toggles the user dropdown menu visibility
   */
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  /**
   * Closes user menu when clicking outside
   * @param event - Click event from the document
   */
  closeUserMenu(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-section')) {
      this.showUserMenu = false;
    }
  }

  /**
   * Opens user profile management
   * In a real application, this would navigate to profile page
   */
  openProfile(): void {
    alert('My Profile - User profile management');
    this.showUserMenu = false;
  }

  /**
   * Opens security settings
   * In a real application, this would navigate to security page
   */
  openSecurity(): void {
    alert('Security Settings - Password, 2FA, security options');
    this.showUserMenu = false;
  }

  /**
   * Opens notification preferences
   * In a real application, this would navigate to notifications page
   */
  openNotifications(): void {
    alert('Notifications - Email and system notification preferences');
    this.showUserMenu = false;
  }

  /**
   * Opens help and support
   * In a real application, this would navigate to help page
   */
  openHelp(): void {
    alert('Help & Support - Documentation and contact support');
    this.showUserMenu = false;
  }

  /**
   * Handles user logout
   * Shows confirmation dialog and processes logout
   */
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      // In real application: clear tokens, redirect to login
      alert('Redirecting to login page...');
      this.showUserMenu = false;
      // Example: window.location.href = '/login';
    }
  }

  /**
   * Opens the specified application
   * Handles navigation to different microfrontend applications
   * @param appName - Name of the application to open
   */
  openApp(appName: string): void {
    switch (appName) {
      case 'supply-chain-tracker':
        const supplyChainUrl = environment.production 
          ? 'https://nandhakumar1717.github.io/nexus-platform/supply-chain-tracker/dashboard'
          : 'http://localhost:4201/dashboard';
        window.location.href = supplyChainUrl;
        break;
        
      case 'pipeline-manager':
        const pipelineUrl = environment.production 
          ? 'https://nandhakumar1717.github.io/nexus-platform/pipeline-manager/dashboard'
          : 'http://localhost:4202/dashboard';
        window.location.href = pipelineUrl;
        break;
        
      case 'automotive-dashboard':
        alert('Automotive Operations Hub - Coming Soon!');
        break;
        
      default:
        alert(`${appName} - Application not found`);
    }
  }
}