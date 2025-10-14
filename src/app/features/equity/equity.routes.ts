import { Routes } from '@angular/router';
import { EquityComponent } from './equity.component';

export const equityRoutes: Routes = [
  {
    path: '',
    redirectTo: 'equity-home',
    pathMatch: 'full'
  },
  {
    path: 'equity-home',
    component: EquityComponent
  },
  {
    path: 'mutual-funds',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./mutual-funds/mutual-funds.component').then(
            c => c.MutualFundsComponent
          )
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./mutual-funds/mutual-fund-details/mutual-fund-details.component').then(
            c => c.MutualFundDetailsComponent
          )
      }
    ]
  },
  {
    path: 'direct-equity',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./direct-equity/direct-equity.component').then(
            c => c.DirectEquityComponent
          )
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./direct-equity/direct-equity-details/direct-equity-details.component').then(
            c => c.DirectEquityDetailsComponent
          )
      }
    ]
  },
  {
    path: 'AIF',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./aif/aif.component').then(c => c.AifComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./aif/sub-aif/sub-aif.component').then(c => c.SubAifComponent)
      }
    ]
  },
  {
    path: 'ETF',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./etf/etf.component').then(c => c.EtfComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./etf/etf-details/etf-details.component').then(
            c => c.EtfDetailsComponent
          )
      }
    ]
  },
  {
    path: 'PMS',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pms/pms.component').then(c => c.PMSComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pms/pms-details/pms-details.component').then(
            c => c.PMSDetailsComponent
          )
      }
    ]
  }
];
