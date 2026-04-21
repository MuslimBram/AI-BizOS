import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Bot, Activity, BrainCircuit, ShieldCheck, CheckCircle2, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AutonomousOS() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-muted-foreground"><Activity className="w-5 h-5 animate-spin mr-2" /> Loading Neural Core...</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Autonomous OS (AI Workforce)</h2>
        </div>
        <Button size="sm" className="h-8 shadow-sm">
          <BrainCircuit className="w-3.5 h-3.5 mr-1.5" /> Deploy New Agent
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Active Workstream</h1>
              <p className="text-sm text-muted-foreground mt-1">Monitor your deployed AI agents executing operations in real-time.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Actions</div>
                  <div className="font-bold text-foreground">{(agents.reduce((acc, a) => acc + a.tasks_completed, 0) || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div key={agent.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className={`absolute top-0 left-0 w-full h-1 ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-background shadow-sm overflow-hidden flex items-center justify-center bg-muted">
                    <Bot className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className={`gap-1.5 px-2 py-1 ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                    {agent.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-foreground truncate">{agent.name}</h3>
                  <div className="text-sm font-medium text-primary mt-0.5">{agent.role}</div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Tasks Done</div>
                    <div className="font-semibold">{agent.tasks_completed.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Accuracy</div>
                    <div className="font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {agent.accuracy}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
