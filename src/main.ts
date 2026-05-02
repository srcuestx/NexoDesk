import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { environment } from './environments/environment';

// Inicializar Firebase ANTES de bootstrap
const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

console.log('🔥 Firebase inicializado correctamente');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch(err => console.error('Error en bootstrap:', err));