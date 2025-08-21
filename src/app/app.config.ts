import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';

// Pick a theme preset
import Lara from '@primeuix/themes/lara';
// You can also try: Aura, Nora, or Material presets from @primeuix/themes

import { routes } from './app.routes';

const MyPreset = definePreset(Lara, {
     semantic: {
    primary: {
      50:  '#e6ecf5',
      100: '#ccd9eb',
      200: '#99b3d6',
      300: '#668cc2',
      400: '#3366ad',
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), // Required for PrimeNG
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
