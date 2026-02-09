import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboard, History, BarChart3, Menu } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { loadDayPlan } = useAppStore();

    const handleTodayClick = () => {
        loadDayPlan(format(new Date(), 'yyyy-MM-dd'));
    };

    const NavLinks = () => (
        <>
            <Link
                to="/"
                onClick={handleTodayClick}
                className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === '/'
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <LayoutDashboard className="w-5 h-5" />
                <span>Today</span>
            </Link>
            <Link
                to="/history"
                className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === '/history'
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <History className="w-5 h-5" />
                <span>History</span>
            </Link>
            <Link
                to="/analytics"
                className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === '/analytics'
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
            </Link>
        </>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-xl h-screen sticky top-0">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">MindFlowa</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLinks />
                </nav>
            </aside>

            {/* Mobile/Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden p-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                    <h1 className="text-lg font-bold">MindFlowa</h1>
                    {/* Simplified mobile menu trigger or just title for now */}
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden border-t bg-card sticky bottom-0 z-20 flex justify-around p-2 pb-safe">
                    <Link
                        to="/"
                        onClick={handleTodayClick}
                        className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors", location.pathname === '/' ? "text-primary" : "text-muted-foreground")}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Today
                    </Link>
                    <Link
                        to="/history"
                        className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors", location.pathname === '/history' ? "text-primary" : "text-muted-foreground")}
                    >
                        <History className="w-5 h-5" />
                        History
                    </Link>
                    <Link
                        to="/analytics"
                        className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors", location.pathname === '/analytics' ? "text-primary" : "text-muted-foreground")}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Analytics
                    </Link>
                </nav>
            </div>
        </div>
    );
};
