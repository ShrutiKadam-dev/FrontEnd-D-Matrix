
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
        path: 'aif',
        loadComponent: () => import('./aif/aif.component').then(c => c.AifComponent)
    },
    {
        path: 'sub-mutual-funds/:id',
        loadComponent: () => import('./sub-mutual-fund/sub-mutual-fund.component').then(c => c.SubMutualFundComponent)
    },

    {
        path: 'sub-aif/:id',
        loadComponent: () => import('./sub-aif/sub-aif.component').then(c => c.SubAifComponent)
    }

];