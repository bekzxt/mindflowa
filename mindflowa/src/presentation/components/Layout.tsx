import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-md mx-auto h-full">
                {children}
            </div>
        </div>
    );
};
