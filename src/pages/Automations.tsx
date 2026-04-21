import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Workflow, Plus, Play, Pause, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function Automations() {
  const [automations, setAutomations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newAuto, setNewAuto] = useState({ name: '', trigger: '', action: '' });

  useEffect(() => {
    apiFetch('/api/automations')
      .then(res => res.json())
      .then(data => setAutomations(data.data || []));
  }, []);

  const handleCreate = async () => {
    if (!newAuto.name || !newAuto.trigger || !newAuto.action) return;
    
    const res = await apiFetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAuto)
    });
    const data = await res.json();
    
    if (data.success) {
      setAutomations([...automations, data.data]);
      setIsOpen(false);
      setNewAuto({ name: '', trigger: '', action: '' });
    }
  };

  const handleToggle = async (id: number) => {
    // Optimistic
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
    
    try {
      await apiFetch(`/api/automations/${id}/toggle`, { method: 'PUT' });
    } catch(e) {
      console.error(e);
      // Revert optimistic on fail
      const res = await apiFetch('/api/automations');
      const data = await res.json();
      setAutomations(data.data || []);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Automations & Workflows</h2>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-[min(var(--radius-md),12px)] border border-transparent text-sm transition-all focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 group/button shrink-0 bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5 font-semibold">
            <Plus className="w-3.5 h-3.5 mr-1" /> New Automation
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold">Rule Name</label>
                <Input value={newAuto.name} onChange={e => setNewAuto({...newAuto, name: e.target.value})} placeholder="e.g. Tag Pricing Leads" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Trigger</label>
                <Input value={newAuto.trigger} onChange={e => setNewAuto({...newAuto, trigger: e.target.value})} placeholder="e.g. Keyword: 'pricing'" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Action</label>
                <Input value={newAuto.action} onChange={e => setNewAuto({...newAuto, action: e.target.value})} placeholder="e.g. Add Tag: 'hot-lead'" />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Rule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {automations.map(auto => (
            <div key={auto.id} className="bg-card border border-border/50 rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{auto.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><span className="font-medium text-foreground/80">When:</span> {auto.trigger}</span>
                    <span className="text-border">→</span>
                    <span className="flex items-center gap-1"><span className="font-medium text-foreground/80">Then:</span> {auto.action}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Executions</div>
                  <div className="text-sm font-semibold">{auto.executions.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  {auto.status === 'active' ? (
                    <Button onClick={() => handleToggle(auto.id)} size="sm" variant="outline" className="h-8 text-xs text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20">
                      <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause
                    </Button>
                  ) : (
                    <Button onClick={() => handleToggle(auto.id)} size="sm" variant="outline" className="h-8 text-xs text-emerald-500 hover:text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20">
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Resume
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {automations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No automations created yet. Click "New Automation" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
