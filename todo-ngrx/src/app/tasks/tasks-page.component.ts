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
  private readonly dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });
  private submitted = false;
  showDone = true;

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
    this.submitted = true;
    this.f.markAllAsTouched();
    if (this.f.invalid) return;
    const { title, description, priority, dueDate } = this.f.value;
    this.store.dispatch(A.addTask({
      title: title!, description: description || undefined,
      priority: (priority as any) ?? 3, dueDate: dueDate || undefined
    }));
    this.f.reset({ title: '', description: '', priority: 3, dueDate: '' });
    this.submitted = false;
  }

  toggle(id: string) { this.store.dispatch(A.toggleComplete({ id })); }
  del(id: string)    { this.store.dispatch(A.removeTask({ id })); }
  upd(id: string, changes: any) { this.store.dispatch(A.updateTask({ id, changes })); }

  changePriority(id: string, event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    if (value >= 1 && value <= 5) {
      this.upd(id, { priority: value as 1 | 2 | 3 | 4 | 5 });
    }
  }

  changeDueDate(id: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.upd(id, { dueDate: value || undefined });
  }

  changeDescription(id: string, event: Event) {
    const raw = (event.target as HTMLTextAreaElement).value;
    const trimmed = raw.trim();
    this.upd(id, { description: trimmed ? raw : undefined });
  }

  toggleDoneVisibility() { this.showDone = !this.showDone; }

  trackByTaskId(_: number, task: { id: string }) { return task.id; }

  get titleHasError() {
    const ctrl = this.f.get('title');
    if (!ctrl) return false;
    return (ctrl.touched || this.submitted) && ctrl.invalid;
  }

  priorityLabel(priority: number | null | undefined) {
    const labels: Record<number, string> = {
      1: 'P1 · Critique',
      2: 'P2 · Haute',
      3: 'P3 · Normale',
      4: 'P4 · Basse',
      5: 'P5 · Très basse',
    };
    return labels[priority ?? 3] ?? labels[3];
  }

  dueLabel(dueDate?: string | null) {
    const days = this.daysUntil(dueDate);
    if (days === undefined) return '';
    const date = new Date(dueDate!);
    const formatted = this.dateFormatter.format(date);
    let relative: string;
    if (days === 0) relative = "aujourd’hui";
    else if (days === 1) relative = 'demain';
    else if (days > 1) relative = `dans ${days} jours`;
    else if (days === -1) relative = 'hier';
    else relative = `il y a ${Math.abs(days)} jours`;
    return `${formatted} · ${relative}`;
  }

  dueClass(dueDate?: string | null) {
    const days = this.daysUntil(dueDate);
    if (days === undefined) return '';
    if (days < 0) return 'overdue';
    if (days === 0) return 'due-today';
    if (days <= 3) return 'due-soon';
    return 'due-later';
  }

  private daysUntil(dueDate?: string | null) {
    if (!dueDate) return undefined;
    const due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) return undefined;
    const today = new Date();
    const startOf = (d: Date) => { const nd = new Date(d); nd.setHours(0,0,0,0); return nd; };
    const dueStart = startOf(due).getTime();
    const todayStart = startOf(today).getTime();
    const diff = Math.round((dueStart - todayStart) / 86400000);
    return diff;
  }
}
