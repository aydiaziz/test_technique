export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 1|2|3|4|5;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
export const newId = () =>
  't_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
