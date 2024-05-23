import { Routes } from '@angular/router';
import { userGuard } from './auth/auth-user/user.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent),
        canActivate: [userGuard]
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./modules/sign-in/sign-in.component').then(c => c.SignInComponent),
        canActivate: [userGuard]
    }
];
