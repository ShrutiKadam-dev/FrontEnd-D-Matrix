import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

// Correct import (from @primeng/themes, not @primeuix)
import Lara from '@primeng/themes/lara';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          cssLayer: { name: 'primeng', order: 'app-styles, primeng' }
        }
      }
    })
  ]
};
