import { LineChart, Rocket } from 'lucide-react';

export function BizBenchmarks() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LineChart className="text-primary" /> Industry Benchmarks
          </h2>
          <p className="text-muted-foreground mt-2">Compare your KPI metrics against abstracted global verticals.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Rocket className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Fetching anonymous peer aggregate benchmarks...</p>
        </div>
      </div>
    </div>
  );
}
