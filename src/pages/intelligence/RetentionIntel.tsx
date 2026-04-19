import { Activity, ShieldCheck } from 'lucide-react';

export function RetentionIntel() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-emerald-500" /> Retention Intelligence
          </h2>
          <p className="text-muted-foreground mt-2">Churn risk identification and cohort survivability predictions.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm text-center py-20">
          <ShieldCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Calculating predictive LTV models...</p>
        </div>
      </div>
    </div>
  );
}
