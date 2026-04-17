import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, LineChart, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const MOCK_STAGES = [
  { id: 'awareness', name: 'Awareness', color: 'border-l-indigo-500' },
  { id: 'decision', name: 'Decision', color: 'border-l-amber-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'border-l-blue-500' },
  { id: 'closed_won', name: 'Closed Won', color: 'border-l-emerald-500' },
];

export function CRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [draggedLead, setDraggedLead] = useState<any>(null);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => setLeads(data.data || []));
  }, []);

  const handleDragStart = (e: React.DragEvent, lead: any) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (!draggedLead || draggedLead.stage === targetStage) return;

    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, stage: targetStage } : l));

    try {
      await fetch(`/api/leads/${draggedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: targetStage })
      });
    } catch (e) {
      console.error('Failed to update lead:', e);
      // Revert optimistic update on failure
      const reverted = await fetch('/api/leads').then(res => res.json());
      setLeads(reverted.data || []);
    } finally {
      setDraggedLead(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">CRM & Pipeline</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="h-8 w-64 bg-muted/50 rounded-md border border-border pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Filter className="w-3.5 h-3.5 mr-2" /> Filter
          </Button>
          <Button size="sm" className="h-8 text-xs bg-primary text-white hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5 mr-2" /> New Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4 flex gap-4 items-start">
        {MOCK_STAGES.map(stage => (
          <div 
            key={stage.id} 
            className="w-[300px] shrink-0 flex flex-col max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{stage.name}</span>
                <Badge variant="secondary" className="text-[10px] bg-muted/50 text-muted-foreground">
                  {leads.filter(l => l.stage === stage.id).length}
                </Badge>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto min-h-[150px] p-1 pb-10">
              {leads.filter(l => l.stage === stage.id).map(lead => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  className={`bg-card border border-border rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors border-l-4 ${stage.color}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm text-foreground">{lead.name}</span>
                    <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">{lead.contact}</div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {lead.tags.map((tag: string) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-2">
                    <div className="flex -space-x-1">
                      <Avatar className="w-5 h-5 border-2 border-card">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.contact}`} />
                        <AvatarFallback className="text-[8px]">{lead.contact.substring(0,2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs font-bold text-foreground">{lead.value}</span>
                  </div>
                </div>
              ))}
              
              {/* Add Lead placeholder area */}
              <button className="border border-dashed border-border/60 rounded-xl p-2 text-xs text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors justify-center flex items-center gap-1 opacity-50 hover:opacity-100 mt-2">
                <Plus className="w-3.5 h-3.5" /> Add card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
