import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { App } from './app/app';

const firebaseConfig = {
  apiKey: "AIzaSyCDUomDpjAltxojbq3pTdDt5SK1pUnAb0c",
  authDomain: "login-material-e7c1e.firebaseapp.com",
  projectId: "login-material-e7c1e",
  storageBucket: "login-material-e7c1e.firebasestorage.app",
  messagingSenderId: "367707926132",
  appId: "1:367707926132:web:90ea17a44c6ca4b2d66b21",
  measurementId: "G-48WP9112DD"
};

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnimations(),
    provideHttpClient() 
  ]
});
