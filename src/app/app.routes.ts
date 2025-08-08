import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'app',
        component:AppComponent
    },
    {
        path: 'features',
        loadChildren: () => import('./features/features.routes').then(m => m.featuresRoutes)
    },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth' },
];