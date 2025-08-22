import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, BreadcrumbComponent],
  template: `
    <div class="app-container">
      <app-navigation></app-navigation>
      <app-breadcrumb></app-breadcrumb>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f8f9fa;
    }
  `]
})
export class AppComponent {
  title = 'supply-chain';
}
