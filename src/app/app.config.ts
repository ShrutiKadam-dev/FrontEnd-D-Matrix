import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

// Pick a theme preset
import Lara from '@primeuix/themes/lara';
// You can also try: Aura, Nora, or Material presets from @primeuix/themes

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), // Required for PrimeNG
    MessageService,
    providePrimeNG({
      theme: {
        preset: Lara, 
        options: {
          cssLayer: { name: 'primeng', order: 'app-styles, primeng' } // optional but recommended if you use Tailwind or global CSS
        }
      }
    })
  ]
};
