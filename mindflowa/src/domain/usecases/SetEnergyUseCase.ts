import type { DayPlan, EnergyLevel } from '../entities/DayPlan';
import type { PlanRepository } from '../repositories/PlanRepository';

export class SetEnergyUseCase {
    private planRepo: PlanRepository;

    constructor(planRepo: PlanRepository) {
        this.planRepo = planRepo;
    }

    async execute(date: string, energy: EnergyLevel): Promise<void> {
        const existingPlan = await this.planRepo.getDayPlan(date);

        if (existingPlan) {
            existingPlan.energyLevel = energy;
            await this.planRepo.saveDayPlan(existingPlan);
        } else {
            const newPlan: DayPlan = {
                date,
                energyLevel: energy,
                capacity: 0, // Will be calculated by GetDayPlan or separate logic
                tasks: [],
                isUrgentMinimumMode: energy === 'low',
            };
            await this.planRepo.saveDayPlan(newPlan);
        }
    }
}
