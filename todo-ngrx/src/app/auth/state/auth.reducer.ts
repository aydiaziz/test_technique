import { createReducer, on } from '@ngrx/store';
import * as Auth from './auth.actions';
import { AuthState } from './auth.models';

const initialState: AuthState = { user: null };

export const authReducer = createReducer(
  initialState,
  on(Auth.login,  (s, { email }) => ({ ...s, user: { email: email.trim().toLowerCase() } })),
  on(Auth.logout, () => initialState),
);
