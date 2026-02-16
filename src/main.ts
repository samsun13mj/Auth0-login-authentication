import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_INITIALIZER } from '@angular/core';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app/app.routes';
import { App } from './app/app';
import { ThemeService } from './app/service/theme-container/theme-service';

/**  Theme init factory */
function initTheme(themeService: ThemeService) {
  return () => themeService.init();
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    /**  FORCE THEME INIT BEFORE APP LOAD */
    {
      provide: APP_INITIALIZER,
      useFactory: initTheme,
      deps: [ThemeService],
      multi: true
    },

    provideAuth0({
      domain: 'dev-bpd8h1p4cb06rurx.us.auth0.com',
      clientId: 'k4R1iFSpXK44L2eVUdtIvbTt32VZQBEp',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://api.bezohminds.com',
        scope: 'openid profile email'
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      useRefreshTokensFallback: true
    })
  ]
}).catch(err => console.error(err));
