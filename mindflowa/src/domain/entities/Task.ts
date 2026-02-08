export type Effort = 'light' | 'medium' | 'heavy';

export interface Task {
    id: string;
    title: string;
    description?: string;
    effort: Effort;
    deadline: string; // ISO Date
    scheduledDate?: string; // ISO Date YYYY-MM-DD
    isCompleted: boolean;
    createdAt: Date;
}

export const EFFORT_VALUES: Record<Effort, number> = {
    light: 1,
    medium: 3,
    heavy: 5,
};
