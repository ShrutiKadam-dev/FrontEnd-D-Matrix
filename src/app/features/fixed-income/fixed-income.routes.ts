
import { Routes } from '@angular/router';
import { FixedIncomeComponent } from './fixed-income.component';

export const commoditiesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'fixed-income',
        pathMatch: 'full'
    },
    {
        path: 'fixed-income',
        component: FixedIncomeComponent
    },
    // {
    //     path: 'fixed-income',
    //     loadComponent: () => import('./etf/etf.component').then(c => c.EtfComponent)
    // },
    // {
    //     path: 'etf-details/:id',
    //     loadComponent: () => import('./etf-details/etf-details.component').then(c => c.EtfDetailsComponent)
    // },
];