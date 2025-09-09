
import { Routes } from '@angular/router';
import { CommoditiesComponent } from './commodities.component';

export const commoditiesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'commodities',
        pathMatch: 'full'
    },
    {
        path: 'commodities',
        component: CommoditiesComponent
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