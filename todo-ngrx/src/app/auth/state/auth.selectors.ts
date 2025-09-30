import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const selectAuth = createFeatureSelector<AuthState>('auth');
export const selectUser = createSelector(selectAuth, s => s.user);
export const selectIsAuthenticated = createSelector(selectUser, u => !!u);
export const selectEmail = createSelector(selectUser, u => u?.email ?? '');
