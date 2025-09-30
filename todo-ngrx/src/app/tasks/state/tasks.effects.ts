import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as T from './tasks.actions';
import * as Auth from '../../auth/state/auth.actions';
import { selectEmail } from '../../auth/state/auth.selectors';
import { selectAllTasks } from './tasks.selectors';
import { map, tap, withLatestFrom } from 'rxjs/operators';

const keyFor = (email:string) => `todo-ngrx:tasks:${email}`;

@Injectable() export class TasksEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadOnLogin$ = createEffect(() => this.actions$.pipe(
    ofType(Auth.login),
    map(({ email }) => {
      const raw = localStorage.getItem(keyFor(email)) || '[]';
      try { return JSON.parse(raw); } catch { return []; }
    }),
    map(tasks => T.loadForUser({ tasks }))
  ));

  persistOnChange$ = createEffect(() => this.actions$.pipe(
    ofType(T.addTask, T.updateTask, T.removeTask, T.toggleComplete, T.loadForUser),
    withLatestFrom(this.store.select(selectEmail), this.store.select(selectAllTasks)),
    tap(([_, email, tasks]) => { if (email) localStorage.setItem(keyFor(email), JSON.stringify(tasks)); })
  ), { dispatch:false });

  clearOnLogout$ = createEffect(() => this.actions$.pipe(
    ofType(Auth.logout),
    map(() => T.clearAll())
  ));
}
