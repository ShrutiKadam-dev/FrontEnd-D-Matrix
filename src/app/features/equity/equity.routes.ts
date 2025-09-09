
import { Routes } from '@angular/router';
import { EquityComponent } from './equity.component';

export const equityRoutes: Routes = [
    {
        path: '',
        redirectTo: 'equity',
        pathMatch: 'full'
    },
    {
        path: 'equity',
        component: EquityComponent
    },
    {
        path: 'mutual-funds',
        loadComponent: () => import('./mutual-funds/mutual-funds.component').then(c => c.MutualFundsComponent)
    },
    {
        path: 'mutual-fund-details/:id',
        loadComponent: () => import('./mutual-funds/mutual-fund-details/mutual-fund-details.component').then(c => c.MutualFundDetailsComponent)
    },
    {
        path: 'direct-equity',
        loadComponent: () => import('./direct-equity/direct-equity.component').then(c => c.DirectEquityComponent)
    },
    {
        path: 'direct-equity-details/:id',
        loadComponent: () => import('./direct-equity/direct-equity-details/direct-equity-details.component').then(c => c.DirectEquityDetailsComponent)
    },
    {
        path: 'aif',
        loadComponent: () => import('./aif/aif.component').then(c => c.AifComponent)
    },
    {
        path: 'sub-aif/:id',
        loadComponent: () => import('./aif/sub-aif/sub-aif.component').then(c => c.SubAifComponent)
    },
    {
        path: 'etf',
        loadComponent: () => import('./etf/etf.component').then(c => c.EtfComponent)
    },
    {
        path: 'etf-details/:id',
        loadComponent: () => import('./etf/etf-details/etf-details.component').then(c => c.EtfDetailsComponent)
    },

];