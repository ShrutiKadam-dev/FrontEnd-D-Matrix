import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';

import Lara from '@primeuix/themes/lara';
import { routes } from './app.routes';

const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#e6ecf5',
      100: '#ccd9eb',
      200: '#99b3d6',
      300: '#668cc2',
      400: '#3366ad',
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    // 👇 this registers DOCUMENT and all browser providers
    importProvidersFrom(BrowserModule),

    // 👇 explicit safety net for DOCUMENT
    { provide: DOCUMENT, useFactory: () => document },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          cssLayer: { name: 'primeng', order: 'app-styles, primeng' }
        }
      }
    })
  ]
};
