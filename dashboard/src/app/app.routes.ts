import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: 'supply-chain',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: 'https://nandhakumar1717.github.io/frontcraft/supply-chain/remoteEntry.js',
      exposedModule: './Module'
    }).then(m => m.SupplyChainModule || m.default)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
