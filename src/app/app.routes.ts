import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { MainLayoutComponent } from './view/shared-container/layout/main-layout/main-layout';
import { DashboardComponent } from './view/dashboard-container/dashboard-component/dashboard-component';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [


  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./view/login-container/login-component/login-component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuardFn],
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: DashboardComponent },

      {
        path: 'profile',
        loadComponent: () =>
          import('./view/profile-container/profile-component/profile-component')
            .then(m => m.ProfileComponent)
      },

      {
        path: 'messages',
        loadComponent: () =>
          import('./view/message-container/message-component/message-component')
            .then(m => m.MessageComponent)
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import('./view/notification-container/notification-component/notification-component')
            .then(m => m.NotificationComponent)
      },

      {
        path: 'tasks',
        loadComponent: () =>
          import('./view/task-container/task-component/task-component')
            .then(m => m.TaskComponent)
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./view/project-container/project-component/project-component')
            .then(m => m.ProjectComponent)
      },

      {
        path: 'calendar',
        loadComponent: () =>
          import('./view/calendar-container/calendar-component/calendar-component')
            .then(m => m.CalendarComponent)
      },

      {
        path: 'analytics',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./view/analytics-container/analytics-component/analytics-component')
            .then(m => m.AnalyticsComponent)
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./view/reports-container/reports-component/reports-component')
            .then(m => m.ReportsComponent)
      },

      {
        path: 'files',
        loadComponent: () =>
          import('./view/files-container/files-component/files-component')
            .then(m => m.FilesComponent)
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./view/settings-container/settings-component/settings-component')
            .then(m => m.SettingsComponent)
      },

      {
        path: 'help',
        loadComponent: () =>
          import('./view/help-container/help-component/help-component')
            .then(m => m.HelpComponent)
      }
    ]
  },

  // ❗ FALLBACK
  { path: '**', redirectTo: 'login' }
];
