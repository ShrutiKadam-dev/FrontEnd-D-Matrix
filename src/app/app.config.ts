import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';

// Pick a theme preset
import Lara from '@primeuix/themes/lara';
import Aura from '@primeuix/themes/aura';
import Material from '@primeuix/themes/material';
import Nora from '@primeuix/themes/nora';
import Tokens from '@primeuix/themes/tokens';
import Types from '@primeuix/themes/types';
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
      500: '', // Main Navy Blue
      600: '#001943',
      700: '#001232',
      800: '#000c21',
      900: '#000610'
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
          cssLayer: { name: 'primeng', order: 'app-styles, primeng' } // optional but recommended if you use Tailwind or global CSS
        }
      }
    })
  ]
};
