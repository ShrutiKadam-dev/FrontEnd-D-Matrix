import { Routes } from '@angular/router';

export const featuresRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'equity',
        loadChildren: () => import('./equity/equity.routes').then(m => m.equityRoutes)
    },
    {
        path: 'commodities',
        loadChildren: () => import('./commodities/commodities.routes').then(c => c.commoditiesRoutes)
    },
    {
        path: 'create',
        loadComponent: () => import('./create/create.component').then(c => c.CreateComponent)
    },
    {
        path: 'compare',
        loadComponent: () => import('./compare/compare.component').then(c => c.CompareComponent)
    },
    {
        path: 'fixed-income',
        loadChildren: () => import('./fixed-income/fixed-income.routes').then(c => c.fixedIncomeRoutes)
    }
];