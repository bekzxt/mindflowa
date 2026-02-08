import type { DayPlan } from '../entities/DayPlan';
import { ENERGY_CAPACITY } from '../entities/DayPlan';
import type { PlanRepository } from '../repositories/PlanRepository';
import type { TaskRepository } from '../repositories/TaskRepository';

export class GetDayPlanUseCase {
    private planRepo: PlanRepository;
    private taskRepo: TaskRepository;

    constructor(planRepo: PlanRepository, taskRepo: TaskRepository) {
        this.planRepo = planRepo;
        this.taskRepo = taskRepo;
    }

    async execute(date: string): Promise<DayPlan> {
        let plan = await this.planRepo.getDayPlan(date);

        if (!plan) {
            plan = {
                date,
                energyLevel: null,
                capacity: 0,
                tasks: [],
                isUrgentMinimumMode: false,
            };
        }

        const allTasks = await this.taskRepo.getAll();
        const tasksForDate = allTasks.filter(t => {
            const taskDate = new Date(t.deadline).toISOString().split('T')[0];
            return taskDate === date; // Simplistic date matching
        });

        // Sort tasks: Urgent first, then by effort
        // In MVP, maybe just by status and effort?
        // Requirement: "Tasks with closer deadlines are prioritized automatically."
        // Here we are viewing a specific day, so deadlines are likely today or past.

        plan.tasks = tasksForDate;

        // Calculate Capacity
        if (plan.energyLevel) {
            plan.capacity = ENERGY_CAPACITY[plan.energyLevel];

            // Urgent Minimum Logic
            if (plan.energyLevel === 'low') {
                plan.isUrgentMinimumMode = true;
                // Filter tasks to show only critical? 
                // "Only the critical tasks required to avoid deadline failure are shown."
                // For MVP, if deadline is TODAY, it is critical.
                // If deadline is FUTURE, maybe hide it? 
                // But this UseCase gets the plan for TODAY. So all tasks here are due today.
                // Maybe we just mark them?
            } else {
                plan.isUrgentMinimumMode = false;
            }
        }

        return plan;
    }
}
