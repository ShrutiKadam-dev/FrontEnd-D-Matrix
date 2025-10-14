import { Routes } from '@angular/router';
import { FixedIncomeComponent } from './fixed-income.component';

export const fixedIncomeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'fixed-income-home',
        pathMatch: 'full'
    },
    {
        path: 'fixed-income-home',
        component: FixedIncomeComponent
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

];
