import { LineChart, TrendingUp, Presentation, AlertCircle } from 'lucide-react';

export function DemandForecast() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LineChart className="text-indigo-500" /> Demand Forecasting
          </h2>
          <p className="text-muted-foreground mt-2">Machine-learning generated projections for sales, lead volume, and resource requirements.</p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
          <TrendingUp className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">Forecast Model Tending Baseline</h3>
          <p className="text-muted-foreground max-w-md text-center mt-2">
            Your historical data is currently being ingested by the autonomous planner. A baseline projection will formulate shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
