import type { DayPlan } from '../entities/DayPlan';

export interface PlanRepository {
    getDayPlan(date: string): Promise<DayPlan | null>;
    saveDayPlan(plan: DayPlan): Promise<void>;
}
