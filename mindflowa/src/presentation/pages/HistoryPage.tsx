import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/Card';
import type { EnergyLevel, DayPlan } from '../../domain/entities/DayPlan';
import { format } from 'date-fns';
import { ArrowLeft, Battery, BatteryMedium, BatteryLow, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { clsx } from 'clsx';

export const HistoryPage: React.FC = () => {
    const { loadHistory } = useAppStore();
    const [history, setHistory] = useState<DayPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const plans = await loadHistory();
            setHistory(plans);
            setLoading(false);
        };
        fetchHistory();
    }, [loadHistory]);

    const getEnergyIcon = (level: EnergyLevel | null) => {
        if (!level) return <Battery className="w-5 h-5 text-gray-400" />;
        switch (level) {
            case 'high': return <Battery className="w-5 h-5 text-green-500" />;
            case 'medium': return <BatteryMedium className="w-5 h-5 text-yellow-500" />;
            case 'low': return <BatteryLow className="w-5 h-5 text-red-500" />;
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold">History</h2>
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No history yet. Start planning today!
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(plan => {
                        const completedCount = plan.tasks.filter(t => t.isCompleted).length;
                        const totalCount = plan.tasks.length;
                        const feedbackColor = plan.dailyFeedback === 'yes' ? 'text-green-600' :
                            plan.dailyFeedback === 'partially' ? 'text-yellow-600' :
                                plan.dailyFeedback === 'no' ? 'text-red-600' : 'text-gray-400';

                        return (
                            <Card key={plan.date} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{format(new Date(plan.date), 'MMM d, yyyy')}</div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                            {getEnergyIcon(plan.energyLevel)}
                                            <span className="capitalize">{plan.energyLevel || 'Unknown'} Dictionary</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium flex items-center gap-1 justify-end">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            {completedCount} / {totalCount}
                                        </div>
                                        {plan.dailyFeedback && (
                                            <div className={clsx("text-xs font-medium mt-1 capitalize", feedbackColor)}>
                                                Reflection: {plan.dailyFeedback}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
