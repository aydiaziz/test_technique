import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './state/auth.selectors';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () =>{
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectIsAuthenticated).pipe(
    map(ok => ok ? true : router.createUrlTree(['/login']))
  );
};
