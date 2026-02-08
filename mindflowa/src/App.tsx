import { useEffect } from 'react';
import { useAppStore } from './presentation/store/useAppStore';
import { Layout } from './presentation/components/Layout';
import { DailyCheckIn } from './presentation/pages/DailyCheckIn';
import { Dashboard } from './presentation/pages/Dashboard';
import { Loader2 } from 'lucide-react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HistoryPage } from './presentation/pages/HistoryPage';
import { AnalyticsPage } from './presentation/pages/AnalyticsPage';

function AppContent() {
  const { loadDayPlan, dayPlan, isLoading, currentDate } = useAppStore();

  useEffect(() => {
    loadDayPlan(currentDate);
  }, [loadDayPlan, currentDate]);

  if (isLoading && !dayPlan) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // If no energy level set for today, we might want to force check-in
  // But routing handles pages. 
  // Strategy: "/" is Dashboard. If no energy, Dashboard shows CheckIn.

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          (!dayPlan || !dayPlan.energyLevel) ? <DailyCheckIn /> : <Dashboard />
        } />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
