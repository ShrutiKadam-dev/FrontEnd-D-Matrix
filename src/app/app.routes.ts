import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'features',
        loadChildren: () => import('./features/features.routes').then(m => m.featuresRoutes)
    },
    {
        path: 'shared',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
    },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth' },
];