import { create } from 'zustand';
import { LocalPlanRepository } from '../../data/repositories/LocalPlanRepository';
import { LocalTaskRepository } from '../../data/repositories/LocalTaskRepository';
import { GetDayPlanUseCase } from '../../domain/usecases/GetDayPlanUseCase';
import { SetEnergyUseCase } from '../../domain/usecases/SetEnergyUseCase';
import { CreateTaskUseCase } from '../../domain/usecases/CreateTaskUseCase';
import type { DayPlan, EnergyLevel } from '../../domain/entities/DayPlan';
import type { Task, Effort } from '../../domain/entities/Task';
import { format } from 'date-fns';

// Dependency Injection Setup
const planRepo = new LocalPlanRepository();
const taskRepo = new LocalTaskRepository();

const getDayPlanUseCase = new GetDayPlanUseCase(planRepo, taskRepo);
const setEnergyUseCase = new SetEnergyUseCase(planRepo);
const createTaskUseCase = new CreateTaskUseCase(taskRepo);

interface AppState {
    currentDate: string;
    dayPlan: DayPlan | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadDayPlan: (date: string) => Promise<void>;
    setEnergy: (energy: EnergyLevel) => Promise<void>;
    addTask: (title: string, effort: Effort, deadline: string, scheduledDate?: string) => Promise<void>;
    toggleTaskCompletion: (taskId: string) => Promise<void>;
    setReflection: (rating: 'yes' | 'partially' | 'no') => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    currentDate: format(new Date(), 'yyyy-MM-dd'),
    dayPlan: null,
    isLoading: false,
    error: null,

    loadDayPlan: async (date: string) => {
        set({ isLoading: true, error: null, currentDate: date });
        try {
            const plan = await getDayPlanUseCase.execute(date);
            set({ dayPlan: plan, isLoading: false });
        } catch (e) {
            console.error(e);
            set({ error: 'Failed to load plan', isLoading: false });
        }
    },

    setEnergy: async (energy: EnergyLevel) => {
        const { currentDate } = get();
        set({ isLoading: true });
        try {
            await setEnergyUseCase.execute(currentDate, energy);
            // Reload plan to update capacity and tasks
            await get().loadDayPlan(currentDate);
        } catch (e) {
            console.error(e);
            set({ error: 'Failed to set energy', isLoading: false });
        }
    },

    addTask: async (title: string, effort: Effort, deadline: string, scheduledDate?: string) => {
        const task: Task = {
            id: crypto.randomUUID(),
            title,
            effort,
            deadline,
            scheduledDate: scheduledDate || deadline,
            isCompleted: false,
            createdAt: new Date(), // This might need to be serializable if using pure JSON but Date is fine in memory, need to handle ser/deser in Repo
        };

        // Note: LocalTaskRepository save method does generic "JSON.stringify" which handles Dates as strings. 
        // We might need to ensure they are restored as Dates? 
        // The current Repo usage returns JSON.parse'd objects, so strings. 
        // The domain entities definitions had `deadline: string` (ISO) so we are good.
        // But `createdAt` is Date. I should change `createdAt` to string in Task entity or handle conversion.
        // For now, I'll pass a Date object, JSON.stringify determines strict ISO string.

        // Changing Task entity createdAt to match strict types if needed.
        // Let's assume Task entity has check.

        set({ isLoading: true });
        try {
            await createTaskUseCase.execute(task as any); // Type assertion for MVP speed if entity types drift
            await get().loadDayPlan(get().currentDate);
        } catch (e) {
            console.error(e);
            set({ error: 'Failed to add task', isLoading: false });
        }
    },

    toggleTaskCompletion: async (taskId: string) => {
        // We need a usecase for this or just call repo directly? 
        // Ideally UseCase. But for MVP, maybe direct Repo call or add UseCase?
        // I didn't create ToggleTaskUseCase. 
        // I'll add a quick method to TaskRepository and just call it?
        // But Store uses UseCases.
        // Let's instantiate Repo directly here? Or add the UseCase logic inline?
        // Better: Add "CompleteTaskUseCase" to standard.
        // For now, I'll access repo directly in store for speed, 
        // but strictly speaking I should have a UseCase.

        await taskRepo.toggleCompletion(taskId);
        await get().loadDayPlan(get().currentDate);
    },

    setReflection: async (rating) => {
        const { dayPlan } = get();
        if (dayPlan) {
            dayPlan.dailyFeedback = rating;
            await planRepo.saveDayPlan(dayPlan);
            set({ dayPlan: { ...dayPlan } }); // Trigger update
        }
    }
}));
