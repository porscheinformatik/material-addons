import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule } from '@ngx-translate/core';

export const dataTableStoryProviders = [importProvidersFrom(TranslateModule.forRoot()), provideAnimationsAsync()];
