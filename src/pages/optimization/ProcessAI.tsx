import { Settings, Cpu, Gauge, Zap } from 'lucide-react';

export function ProcessAI() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="text-indigo-500" /> Process Optimization AI
          </h2>
          <p className="text-muted-foreground mt-2">Identify bottlenecks and synthesize operational workflows.</p>
        </div>

        <div className="bg-card p-8 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Active System Scans</h3>
            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Online</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted-foreground flex items-center gap-2"><Cpu className="w-4 h-4" /> API Throughput Latency</span>
                <span className="font-bold">Optimized (12ms)</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[95%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4" /> CRM Data Deduplication</span>
                <span className="font-bold">Running</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[60%] animate-pulse"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted-foreground flex items-center gap-2"><Gauge className="w-4 h-4" /> Email Delivery Reputation</span>
                <span className="font-bold text-rose-500">Warning (82%)</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[82%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
