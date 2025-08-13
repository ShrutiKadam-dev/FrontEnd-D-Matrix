
import { Routes } from '@angular/router';

export const equityRoutes: Routes = [
    {
        path: '',
        redirectTo: 'mutual-funds',
        pathMatch: 'full'
    },
    {
        path: 'mutual-funds',
        loadComponent: () => import('./mutual-funds/mutual-funds.component').then(c => c.MutualFundsComponent)
    },


];