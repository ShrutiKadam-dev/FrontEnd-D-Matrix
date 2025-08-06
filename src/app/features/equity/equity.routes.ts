import { Routes } from '@angular/router';
import { EquityComponent } from './equity.component';

export const equityRoutes: Routes = [
    {
        path: '',
        component: EquityComponent,
        children: [
            {
                path: 'mutual-funds',
                loadComponent: () => import('./mutual-funds/mutual-funds.component').then(c => c.MutualFundsComponent)
            }

        ]
    }
];