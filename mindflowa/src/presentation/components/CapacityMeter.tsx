import React from 'react';
import { cn } from '../components/Button';

interface CapacityMeterProps {
    used: number;
    total: number;
}

export const CapacityMeter: React.FC<CapacityMeterProps> = ({ used, total }) => {
    const percentage = Math.min(100, (used / total) * 100);
    const isOver = used > total;

    let colorClass = "bg-primary";
    if (percentage > 80) colorClass = "bg-yellow-500";
    if (percentage >= 100) colorClass = "bg-red-500";
    if (isOver) colorClass = "bg-red-600 animate-pulse";

    return (
        <div className="w-full space-y-1">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Capacity</span>
                <span>{used} / {total} points</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-500 ease-out", colorClass)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {isOver && <p className="text-xs text-red-500 font-bold mt-1">Over capacity! Remove tasks.</p>}
        </div>
    );
};
