import { Shield, LineChart } from 'lucide-react';

export function PlatformAnalytics() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <LineChart className="text-indigo-500" /> Platform Analytics
        </h2>
        <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col items-center justify-center h-64">
           <LineChart className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Global system metrics, revenue operations, and deep platform analytics.</p>
        </div>
      </div>
    </div>
  );
}
