import { Workflow, RefreshCcw } from 'lucide-react';

export function GrowthLoop() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="text-emerald-500" /> Viral Growth Loops
          </h2>
          <p className="text-muted-foreground mt-2">Configure referral mechanics and multi-sided platform viral coefficients.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <RefreshCcw className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Calculating theoretical K-Factor limits across referral campaigns...</p>
        </div>
      </div>
    </div>
  );
}
