import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore'; // Corrected import path if needed, check where useAppStore is.
// It seems useAppStore is in ../store/useAppStore based on previous files.
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Activity, CheckCircle2, Battery, Trophy } from 'lucide-react';
import { EnergyLevel, DayPlan } from '../../domain/entities/DayPlan';

// Helper to convert energy to number
const energyToNumber = (level: EnergyLevel | null): number => {
    switch (level) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
    }
};

export const AnalyticsPage: React.FC = () => {
    const { loadHistory } = useAppStore();
    const [history, setHistory] = useState<DayPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadHistory();
            // Sort by date ascending for charts
            const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setHistory(sorted);
            setLoading(false);
        };
        fetchData();
    }, [loadHistory]);

    // Process Data for Charts
    const chartData = history.map(plan => ({
        date: format(new Date(plan.date), 'MMM d'),
        energy: energyToNumber(plan.energyLevel),
        completed: plan.tasks.filter(t => t.isCompleted).length,
        total: plan.tasks.length,
        rate: plan.tasks.length > 0 ? Math.round((plan.tasks.filter(t => t.isCompleted).length / plan.tasks.length) * 100) : 0
    })).slice(-7); // Last 7 entries

    // Metrics
    const totalTasksCompleted = history.reduce((acc, plan) => acc + plan.tasks.filter(t => t.isCompleted).length, 0);
    const avgEnergy = history.length > 0
        ? (history.reduce((acc, plan) => acc + energyToNumber(plan.energyLevel), 0) / history.length).toFixed(1)
        : 0;
    const avgCompletionRate = history.length > 0
        ? Math.round(history.reduce((acc, plan) => acc + (plan.tasks.length > 0 ? plan.tasks.filter(t => t.isCompleted).length / plan.tasks.length : 0), 0) / history.length * 100)
        : 0;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold">Analytics</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                        <div>
                            <div className="text-2xl font-bold">{totalTasksCompleted}</div>
                            <div className="text-xs text-muted-foreground">Tasks Done</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <Activity className="w-8 h-8 text-blue-500" />
                        <div>
                            <div className="text-2xl font-bold">{avgCompletionRate}%</div>
                            <div className="text-xs text-muted-foreground">Avg Completion</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <Battery className="w-8 h-8 text-yellow-500" />
                        <div>
                            <div className="text-2xl font-bold">{avgEnergy}/3</div>
                            <div className="text-xs text-muted-foreground">Avg Energy</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <Trophy className="w-8 h-8 text-purple-500" />
                        <div>
                            <div className="text-xl font-bold">{history.length}</div>
                            <div className="text-xs text-muted-foreground">Days Tracked</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Energy Trend */}
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Energy Trend (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] p-0 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="energy" stroke="#8884d8" fillOpacity={1} fill="url(#colorEnergy)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Task Completion */}
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Task Completion (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] p-0 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
