import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app/app.routes';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    provideAuth0({
      domain: 'dev-bpd8h1p4cb06rurx.us.auth0.com',
      clientId: 'k4R1iFSpXK44L2eVUdtIvbTt32VZQBEp',

      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://api.bezohminds.com', // 🔥 JWT audience
        scope: 'openid profile email offline_access'
      },

      // 🔥 IMPORTANT FOR REFRESH & NO CONSENT LOOP
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      useRefreshTokensFallback: true
    })

  ]
}).catch(err => console.error(err));