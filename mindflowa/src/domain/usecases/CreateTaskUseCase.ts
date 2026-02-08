import type { Task } from '../entities/Task';
import type { TaskRepository } from '../repositories/TaskRepository';

export class CreateTaskUseCase {
    private taskRepo: TaskRepository;

    constructor(taskRepo: TaskRepository) {
        this.taskRepo = taskRepo;
    }

    async execute(task: Task): Promise<void> {
        // Basic validation
        if (!task.title) {
            throw new Error("Task title is required");
        }

        // In a real app, we might check capacity here before adding.
        // For MVP, we'll allow adding and just warn in UI.

        await this.taskRepo.save(task);
    }
}
