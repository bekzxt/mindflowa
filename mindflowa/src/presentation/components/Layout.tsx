import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboard, History, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { loadDayPlan } = useAppStore();

    const handleTodayClick = () => {
        loadDayPlan(format(new Date(), 'yyyy-MM-dd'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-foreground p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-black shadow-none sm:shadow-xl min-h-screen flex flex-col relative">
                <nav className="p-4 border-b flex justify-around sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <Link
                        to="/"
                        onClick={handleTodayClick}
                        className={clsx("flex flex-col items-center gap-1 text-xs font-medium transition-colors", location.pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Today
                    </Link>
                    <Link to="/history" className={clsx("flex flex-col items-center gap-1 text-xs font-medium transition-colors", location.pathname === '/history' ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                        <History className="w-5 h-5" />
                        History
                    </Link>
                    <Link to="/analytics" className={clsx("flex flex-col items-center gap-1 text-xs font-medium transition-colors", location.pathname === '/analytics' ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                        <BarChart3 className="w-5 h-5" />
                        Analytics
                    </Link>
                </nav>
                <div className="p-4 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};
