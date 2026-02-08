import { useEffect } from 'react';
import { useAppStore } from './presentation/store/useAppStore';
import { Layout } from './presentation/components/Layout';
import { DailyCheckIn } from './presentation/pages/DailyCheckIn';
import { Dashboard } from './presentation/pages/Dashboard';
import { Loader2 } from 'lucide-react';

function App() {
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

  // If no energy level set for today, show check-in
  if (!dayPlan || !dayPlan.energyLevel) {
    return (
      <Layout>
        <DailyCheckIn />
      </Layout>
    );
  }

  // Otherwise show Dashboard
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
