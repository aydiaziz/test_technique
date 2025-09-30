import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './auth/state/auth.reducer';
import { tasksReducer } from './tasks/state/tasks.reducer';
import { TasksEffects } from './tasks/state/tasks.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideStore({ auth: authReducer , tasks: tasksReducer}), provideEffects([TasksEffects]), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
