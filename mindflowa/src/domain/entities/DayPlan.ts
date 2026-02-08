import type { Task } from './Task';

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface DayPlan {
    date: string; // ISO date string YYYY-MM-DD
    energyLevel: EnergyLevel | null;
    capacity: number;
    tasks: Task[]; // Tasks assigned to this day
    isUrgentMinimumMode: boolean;
    dailyFeedback?: 'yes' | 'partially' | 'no';
}

export const ENERGY_CAPACITY: Record<EnergyLevel, number> = {
    low: 5,
    medium: 10,
    high: 15,
};
