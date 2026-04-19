import { Shield, Activity } from 'lucide-react';

export function ActivationStatus() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Activity className="text-indigo-500" /> Activation Status
        </h2>
        <div className="bg-card p-8 rounded-2xl border shadow-sm">
          <p className="text-muted-foreground">Monitor platform activation loops and pending SaaS tenant verifications here.</p>
        </div>
      </div>
    </div>
  );
}
