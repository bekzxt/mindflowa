import type { Task } from '../../domain/entities/Task';
import type { TaskRepository } from '../../domain/repositories/TaskRepository';

const STORAGE_KEY = 'mindflowa_tasks';

export class LocalTaskRepository implements TaskRepository {
    async getAll(): Promise<Task[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    async getById(id: string): Promise<Task | null> {
        const tasks = await this.getAll();
        return tasks.find(t => t.id === id) || null;
    }

    async save(task: Task): Promise<void> {
        const tasks = await this.getAll();
        const index = tasks.findIndex(t => t.id === task.id);

        if (index >= 0) {
            tasks[index] = task;
        } else {
            tasks.push(task);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    async delete(id: string): Promise<void> {
        const tasks = await this.getAll();
        const filtered = tasks.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    async toggleCompletion(id: string): Promise<void> {
        const tasks = await this.getAll();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.isCompleted = !task.isCompleted;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }
}
