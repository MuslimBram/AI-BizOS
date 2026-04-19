import { Users, UserPlus, Workflow, Bot } from 'lucide-react';

export function WorkforceAI() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-indigo-500" /> Workforce AI
          </h2>
          <p className="text-muted-foreground mt-2">Manage the synergy between your human teams and autonomous agents.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <Bot className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg">Agent Allocation</h3>
            <p className="text-sm text-muted-foreground mt-2">Distribute workload dynamically to Autonomous OS pods during peak demand surges.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <Workflow className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg">Human-in-the-Loop</h3>
            <p className="text-sm text-muted-foreground mt-2">Set precision thresholds for when an AI must escalate to a human operator.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
