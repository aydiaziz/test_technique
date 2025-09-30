import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as A from './state/tasks.actions';
import { selectOpenTasks, selectDoneTasks, selectCounts } from './state/tasks.selectors';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})
export class TasksPageComponent {
  f = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(160)]],
    description: [''],
    priority: [3 as 1|2|3|4|5],
    dueDate: [''],
  });

  open$ = this.store.select(selectOpenTasks);
  done$ = this.store.select(selectDoneTasks);
  counts$ = this.store.select(selectCounts);

  constructor(private fb: FormBuilder, private store: Store) {}

  add() {
    if (this.f.invalid) return;
    const { title, description, priority, dueDate } = this.f.value;
    this.store.dispatch(A.addTask({
      title: title!, description: description || undefined,
      priority: (priority as any) ?? 3, dueDate: dueDate || undefined
    }));
    this.f.reset({ title: '', description: '', priority: 3, dueDate: '' });
  }

  toggle(id: string) { this.store.dispatch(A.toggleComplete({ id })); }
  del(id: string)    { this.store.dispatch(A.removeTask({ id })); }
  upd(id: string, changes: any) { this.store.dispatch(A.updateTask({ id, changes })); }
}
