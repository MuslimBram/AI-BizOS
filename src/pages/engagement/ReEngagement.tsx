import { Target, MessageSquareCode } from 'lucide-react';

export function ReEngagement() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="text-rose-500" /> Re-Engagement Engine
          </h2>
          <p className="text-muted-foreground mt-2">Trigger targeted win-back campaigns to inactive customer cohorts.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <MessageSquareCode className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Mapping inactive cohorts for dynamic SMS/Email win-back drips...</p>
        </div>
      </div>
    </div>
  );
}
