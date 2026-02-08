import type { DayPlan } from '../../domain/entities/DayPlan';
import type { PlanRepository } from '../../domain/repositories/PlanRepository';

const STORAGE_KEY = 'mindflowa_plans';

export class LocalPlanRepository implements PlanRepository {
    async getDayPlan(date: string): Promise<DayPlan | null> {
        const data = localStorage.getItem(STORAGE_KEY);
        const plans: DayPlan[] = data ? JSON.parse(data) : [];
        return plans.find(p => p.date === date) || null;
    }

    async saveDayPlan(plan: DayPlan): Promise<void> {
        const data = localStorage.getItem(STORAGE_KEY);
        const plans: DayPlan[] = data ? JSON.parse(data) : [];

        const index = plans.findIndex(p => p.date === plan.date);
        if (index >= 0) {
            plans[index] = plan;
        } else {
            plans.push(plan);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    }

    async getAllPlans(): Promise<DayPlan[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        const plans: DayPlan[] = data ? JSON.parse(data) : [];
        return plans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
}
