import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './Card';
import type { EnergyLevel } from '../../domain/entities/DayPlan';
import { Sparkles } from 'lucide-react';

interface MotivationalQuoteProps {
    energyLevel: EnergyLevel;
}

const QUOTES: Record<EnergyLevel, string[]> = {
    high: [
        "You're on fire! 🔥 Crush those goals!",
        "Maximum power! 🚀 Nothing can stop you now.",
        "Seize the day! Your energy is unstoppable.",
        "Go big today! You've got the capacity for it.",
        "Challenge yourself! Today is the day for breakthroughs."
    ],
    medium: [
        "Steady and strong. You've got this. 💪",
        "Keep moving forward, one step at a time.",
        "Balance is key. You're doing great.",
        "Consistent effort brings amazing results.",
        "Focus on what matters most."
    ],
    low: [
        "Be gentle with yourself. Small steps count. 🌿",
        "It's okay to rest. Do the minimum and recharge.",
        "Progression, not perfection. Just breathe.",
        "Survive today, thrive tomorrow. ❤️",
        "You are enough, even on slow days."
    ]
};

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ energyLevel }) => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const quotes = QUOTES[energyLevel];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, [energyLevel]);

    return (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-none shadow-sm mb-6">
            <CardContent className="p-4 flex items-center gap-3 text-sm font-medium text-muted-foreground italic">
                <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>"{quote}"</span>
            </CardContent>
        </Card>
    );
};
