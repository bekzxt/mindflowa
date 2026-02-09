import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/Card';
import { CapacityMeter } from '../components/CapacityMeter';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { EndDayReflection } from '../components/EndDayReflection';
import { Plus, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import type { Effort, Task } from '../../domain/entities/Task';
import { EFFORT_VALUES } from '../../domain/entities/Task';
import { clsx } from 'clsx';
import { format, addDays, subDays } from 'date-fns';
import confetti from 'canvas-confetti';
import { MotivationalQuote } from '../components/MotivationalQuote';

export const Dashboard: React.FC = () => {
    const { dayPlan, addTask, toggleTaskCompletion, currentDate, loadDayPlan } = useAppStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskEffort, setNewTaskEffort] = useState<Effort>('medium');
    const [isAdding, setIsAdding] = useState(false);

    const handlePrevDay = () => {
        const newDate = subDays(new Date(currentDate), 1);
        loadDayPlan(format(newDate, 'yyyy-MM-dd'));
    };

    const handleNextDay = () => {
        const newDate = addDays(new Date(currentDate), 1);
        loadDayPlan(format(newDate, 'yyyy-MM-dd'));
    };

    if (!dayPlan) return null;

    // Use totalUsedCapacity for validation
    const totalUsedCapacity = dayPlan.tasks.reduce((acc: number, t: Task) => acc + EFFORT_VALUES[t.effort], 0);
    // "Prevent users from adding tasks beyond this capacity." -> Suggests planning capacity.
    // If I complete a task, does it free up capacity? No, energy is spent.
    // So Used Capacity = sum of ALL tasks planned for today, regardless of completion?
    // Or maybe only pending?
    // "Energy level affects how many tasks can be planned"
    // So used capacity should be based on ALL tasks in the plan.

    // Correction: Used capacity should be sum of all tasks.

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        // Simple check for MVP (store might need to handle this to be pure)
        // But UI should optionally block
        if (totalUsedCapacity + EFFORT_VALUES[newTaskEffort] > dayPlan.capacity) {
            if (!confirm("This will exceed your daily capacity. Add anyway?")) return;
        }

        await addTask(newTaskTitle, newTaskEffort, currentDate);
        setNewTaskTitle('');
        setIsAdding(false);
        await addTask(newTaskTitle, newTaskEffort, currentDate);
        setNewTaskTitle('');
        setIsAdding(false);
    };

    const handleToggleTask = async (task: Task) => {
        if (!task.isCompleted) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        await toggleTaskCompletion(task.id);
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={handlePrevDay}>
                            &lt;
                        </Button>
                        <h2 className="text-2xl font-bold text-red-600">{format(new Date(dayPlan.date), 'EEEE, MMM d')}</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={handleNextDay}>
                            &gt;
                        </Button>
                    </div>
                    <p className="text-muted-foreground capitalize ml-10">Energy: {dayPlan.energyLevel}</p>
                </div>
                {dayPlan.isUrgentMinimumMode && (
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-200">
                        <AlertTriangle className="w-3 h-3" /> Urgent Min
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Tasks */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tasks */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Your Plan</h3>
                        </div>

                        {dayPlan.tasks.length === 0 && !isAdding && (
                            <div className="text-center py-10 text-muted-foreground italic border-2 border-dashed rounded-xl">
                                No tasks planned yet.
                                <br />
                                <Button variant="link" onClick={() => setIsAdding(true)}>Add your first task</Button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {dayPlan.tasks.map(task => (
                                <div key={task.id} className={clsx(
                                    "group flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-all",
                                    task.isCompleted ? "opacity-60 bg-muted/50" : "bg-white dark:bg-gray-800",
                                    dayPlan.isUrgentMinimumMode && !task.isCompleted ? "border-red-200" : ""
                                )}>
                                    <div className="flex items-center gap-3 overflow-hidden w-full">
                                        <button onClick={() => handleToggleTask(task)} className="text-primary hover:scale-110 transition-transform shrink-0">
                                            {task.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                        </button>
                                        <div className="truncate flex-1">
                                            <div className={clsx("font-medium truncate", task.isCompleted && "line-through")}>{task.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span className={clsx(
                                                    "capitalize px-1.5 py-0.5 rounded text-[10px]",
                                                    task.effort === 'heavy' ? "bg-red-100 text-red-700" :
                                                        task.effort === 'medium' ? "bg-yellow-100 text-yellow-700" :
                                                            "bg-blue-100 text-blue-700"
                                                )}>
                                                    {task.effort} ({EFFORT_VALUES[task.effort]})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Task Form */}
                        {isAdding ? (
                            <Card className="border-dashed border-2 animate-in fade-in zoom-in duration-300">
                                <CardContent className="p-4 space-y-3">
                                    <Input
                                        autoFocus
                                        placeholder="Task title..."
                                        value={newTaskTitle}
                                        onChange={e => setNewTaskTitle(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        {(['light', 'medium', 'heavy'] as Effort[]).map((eff) => (
                                            <button
                                                key={eff}
                                                onClick={() => setNewTaskEffort(eff)}
                                                className={clsx(
                                                    "flex-1 text-xs py-1.5 rounded-md border transition-colors",
                                                    newTaskEffort === eff
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background hover:bg-muted"
                                                )}
                                            >
                                                {eff} ({EFFORT_VALUES[eff]})
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                                        <Button type="button" size="sm" onClick={handleAddTask}>Add Task</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Button variant="outline" className="w-full border-dashed py-6" onClick={() => setIsAdding(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Add Task
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-6">
                    {/* Capacity Card */}
                    <Card className="glass-card border-none shadow-md">
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Daily Capacity</h3>
                            <CapacityMeter used={totalUsedCapacity} total={dayPlan.capacity} />
                        </CardContent>
                    </Card>

                    {/* Motivational Quote */}
                    {dayPlan.energyLevel && <MotivationalQuote energyLevel={dayPlan.energyLevel} />}

                    {/* Reflection */}
                    <div className="bg-card rounded-xl border p-4 shadow-sm">
                        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Reflection</h3>
                        <EndDayReflection onSubmit={async (rating) => {
                            const { setReflection } = useAppStore.getState();
                            await setReflection(rating);
                            alert("Reflection saved. Good job today!");
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
