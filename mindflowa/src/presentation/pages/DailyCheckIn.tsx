import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { Battery, BatteryMedium, BatteryWarning } from 'lucide-react';
import { clsx } from 'clsx';
import type { EnergyLevel } from '../../domain/entities/DayPlan';

const ENERGY_OPTIONS: { value: EnergyLevel; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'high', label: 'High Energy', icon: <Battery className="w-8 h-8" />, color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' },
    { value: 'medium', label: 'Medium Energy', icon: <BatteryMedium className="w-8 h-8" />, color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' },
    { value: 'low', label: 'Low Energy', icon: <BatteryWarning className="w-8 h-8" />, color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' },
];

export const DailyCheckIn: React.FC = () => {
    const { setEnergy, currentDate, loadDayPlan } = useAppStore();
    const [selected, setSelected] = useState<EnergyLevel | null>(null);

    const isToday = currentDate === format(new Date(), 'yyyy-MM-dd');
    const formattedDate = format(new Date(currentDate), 'EEEE, MMM d');

    const handlePrevDay = () => {
        const newDate = subDays(new Date(currentDate), 1);
        loadDayPlan(format(newDate, 'yyyy-MM-dd'));
    };

    const handleNextDay = () => {
        const newDate = addDays(new Date(currentDate), 1);
        loadDayPlan(format(newDate, 'yyyy-MM-dd'));
    };


    const handleContinue = () => {
        if (selected) {
            setEnergy(selected);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] justify-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2 relative">
                <div className="flex items-center justify-center gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handlePrevDay}>
                        &lt;
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        {isToday ? "Good Morning!" : `Planning for`}
                    </h1>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleNextDay}>
                        &gt;
                    </Button>
                </div>
                {!isToday && <div className="text-lg font-medium text-primary">{formattedDate}</div>}
                <p className="text-muted-foreground">
                    How is your energy level today?
                </p>
            </div>

            <div className="grid gap-4">
                {ENERGY_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSelected(option.value)}
                        className={clsx(
                            "flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left",
                            selected === option.value ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg" : "hover:scale-[1.01]",
                            option.color,
                            selected === option.value ? "border-primary" : "border-transparent"
                        )}
                    >
                        <div className="mr-4 p-2 bg-white/50 rounded-full backdrop-blur-sm">
                            {option.icon}
                        </div>
                        <div>
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-xs opacity-80">
                                {option.value === 'high' ? 'Ready to tackle everything.' :
                                    option.value === 'medium' ? 'Good for steady progress.' :
                                        'Focus on essentials only.'}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-4">
                <Button
                    className="w-full text-lg h-12 shadow-md"
                    disabled={!selected}
                    onClick={handleContinue}
                >
                    Start My Day
                </Button>
            </div>
        </div>
    );
};
