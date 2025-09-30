import { createAction, props } from '@ngrx/store';
import { Task } from './tasks.models';

export const addTask = createAction('[Tasks] Add',
  props<{ title:string; description?:string; priority:1|2|3|4|5; dueDate?:string }>());
export const updateTask = createAction('[Tasks] Update',
  props<{ id:string; changes: Partial<Omit<Task,'id'|'createdAt'>> }>());
export const removeTask = createAction('[Tasks] Remove', props<{ id:string }>());
export const toggleComplete = createAction('[Tasks] Toggle Complete', props<{ id:string }>());

export const loadForUser = createAction('[Tasks] Load For User', props<{ tasks: Task[] }>());
export const clearAll = createAction('[Tasks] Clear All');
