
import { Routes } from '@angular/router';
import { FixedIncomeComponent } from './fixed-income.component';

export const fixedIncomeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'fixed-income',
        pathMatch: 'full'
    },
    {
        path: 'fixed-income',
        component: FixedIncomeComponent
    },
    {
        path: 'etf',
        loadComponent: () => import('./etf/etf.component').then(c => c.EtfComponent)
    },
    {
        path: 'etf-details/:id',
        loadComponent: () => import('./etf/etf-details/etf-details.component').then(c => c.EtfDetailsComponent)
    },
    {
        path: 'aif',
        loadComponent: () => import('./aif/aif.component').then(c => c.AifComponent)
    },
    {
        path: 'sub-aif/:id',
        loadComponent: () => import('./aif/sub-aif/sub-aif.component').then(c => c.SubAifComponent)
    },
];