
import { Routes } from '@angular/router';
import { CommoditiesComponent } from './commodities.component';

export const commoditiesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'commodities-home',
        pathMatch: 'full'
    },
    {
        path: 'commodities-home',
        component: CommoditiesComponent
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

];
