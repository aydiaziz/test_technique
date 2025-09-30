import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
{ path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
{ path: 'app', canActivate: [authGuard], loadComponent: () => import('./tasks/tasks-page.component').then(m => m.TasksPageComponent) },
{ path: '', pathMatch: 'full', redirectTo: 'login' },
{ path: '**', redirectTo: 'login' },

    
    
];
