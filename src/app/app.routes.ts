import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'users',
        loadComponent: () => import('./modules/users/users.component').then(c => c.UsersComponent)
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./modules/sign-in/sign-in.component').then(c => c.SignInComponent)
    }
];
