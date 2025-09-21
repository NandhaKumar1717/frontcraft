import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  // Default route redirects to nexus-platform
  { 
    path: '', 
    redirectTo: '/nexus-platform', 
    pathMatch: 'full' 
  },
  
  // Parent app route
  { 
    path: 'nexus-platform', 
    component: DashboardComponent 
  },
  
  // Child app routes
  { 
    path: 'nexus-platform/supply-chain-tracker/:screen', 
    component: DashboardComponent 
  },
  
  // Redirect any unknown routes to parent
  { 
    path: '**', 
    redirectTo: '/nexus-platform' 
  }
];