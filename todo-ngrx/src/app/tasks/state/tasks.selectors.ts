import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';
import { _selectAll } from './tasks.reducer';

export const selectTasks = createFeatureSelector<TasksState>('tasks');
export const selectAllTasks = createSelector(selectTasks, _selectAll);
export const selectOpenTasks = createSelector(selectAllTasks, L => L.filter(t=>!t.completed));
export const selectDoneTasks = createSelector(selectAllTasks, L => L.filter(t=>t.completed));
export const selectCounts = createSelector(selectAllTasks, L => ({ total:L.length, done:L.filter(t=>t.completed).length }));
