import { Routes } from '@angular/router';
import { LoginComponent } from './view/login-container/login-component/login-component';
import { DashboardComponent } from './view/dashboard-container/dashboard-component/dashboard-component';
import { AuthGuard } from './core/guards/auth-guard-guard';
import { LoginGuard } from './core/guards/login-guard';
import { MainLayoutComponent } from './view/shared-container/layout/main-layout/main-layout';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },

  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { 
        path: 'profile', 
        loadComponent: () => import('./view/profile-container/profile-component/profile-component').then(m => m.ProfileComponent) 
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./view/settings-container/settings-component/settings-component').then(m => m.SettingsComponent) 
      },
      { 
        path: 'reports', 
        loadComponent: () => import('./view/reports-container/reports-component/reports-component').then(m => m.ReportsComponent) 
      },

      
      {
        path: 'user-details/:id',
        loadComponent: () => import('./view/user-details-container/user-details/user-details').then(m => m.UserDetails)
      },
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];