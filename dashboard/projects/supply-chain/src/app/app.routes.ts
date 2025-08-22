import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShipmentsComponent } from './components/shipments/shipments.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'shipments', component: ShipmentsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'reports', component: ReportsComponent }
];
