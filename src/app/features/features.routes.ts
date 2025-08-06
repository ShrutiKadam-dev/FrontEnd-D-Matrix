import { Routes } from '@angular/router';

export const featuresRoutes: Routes = [
    // {
    //     path: 'home',
    //     loadChildren: () => import('./home/home.component').then(m => m.HomeComponent)
    // },
    {
        path: 'equity',
        loadChildren: () => import('./equity/equity.routes').then(m => m.equityRoutes)
    },
    // {
    //     path: 'fixed-income',
    //     loadChildren: () => import('./fixed-income/fixed-income.component').then(m => m.FixedIncomeComponent)
    // },
    // {
    //     path: 'commodities',
    //     loadChildren: () => import('./commodities/commodities.component').then(m => m.CommoditiesComponent)
    // },
    // {
    //     path: 'create',
    //     loadChildren: () => import('./create/create.component').then(m => m.CreateComponent)
    // },
];