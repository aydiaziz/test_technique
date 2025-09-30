import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as A from './tasks.actions';
import { Task, newId } from './tasks.models';

export type TasksState = EntityState<Task>;
const adapter = createEntityAdapter<Task>({
  selectId: t => t.id,
  sortComparer: (a,b) => a.createdAt.localeCompare(b.createdAt),
});
const initialState: TasksState = adapter.getInitialState();

export const tasksReducer = createReducer(
  initialState,
  on(A.addTask, (s, { title, description, priority, dueDate }) => {
    const now = new Date().toISOString();
    const t: Task = { id:newId(), title:title.trim(), description, priority,
      dueDate, completed:false, createdAt:now, updatedAt:now };
    return adapter.addOne(t, s);
  }),
  on(A.updateTask, (s, { id, changes }) =>
    adapter.updateOne({ id, changes:{ ...changes, updatedAt:new Date().toISOString() } }, s)),
  on(A.removeTask, (s, { id }) => adapter.removeOne(id, s)),
  on(A.toggleComplete, (s, { id }) => {
    const t = s.entities[id]; if (!t) return s;
    return adapter.updateOne({ id, changes:{ completed:!t.completed, updatedAt:new Date().toISOString() } }, s);
  }),
  on(A.loadForUser, (s, { tasks }) => adapter.setAll(tasks, s)),
  on(A.clearAll, () => initialState),
);

export const { selectAll: _selectAll } = adapter.getSelectors();
