import { Layers, RefreshCcw } from 'lucide-react';

export function IntegrationChannels() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="text-indigo-500" /> Omni-Channel Orchestration
          </h2>
          <p className="text-muted-foreground mt-2">Manage routing, fallback logic, and message queues across integrated channels.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <RefreshCcw className="w-16 h-16 text-muted-foreground/30 mb-4 animate-spin-slow" />
          <p className="text-muted-foreground">Syncing unified inbox channels with connected external APIs...</p>
        </div>
      </div>
    </div>
  );
}
