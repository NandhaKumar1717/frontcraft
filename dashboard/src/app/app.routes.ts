import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'supply-chain', component: DashboardComponent },
  { path: 'supply-chain/**', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
