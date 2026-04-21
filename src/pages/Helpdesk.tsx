import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { LifeBuoy, Plus, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Helpdesk() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'low' });

  useEffect(() => {
    apiFetch('/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data.data || []));
  }, []);

  const handleCreate = async () => {
    if (!newTicket.subject) return;
    
    const res = await apiFetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    });
    const data = await res.json();
    
    if (data.success) {
      setTickets([data.data, ...tickets]);
      setIsOpen(false);
      setNewTicket({ subject: '', priority: 'low' });
    }
  };

  const handleResolve = async (id: number) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
    try {
      await apiFetch(`/api/tickets/${id}/resolve`, { method: 'PUT' });
    } catch(e) {
      console.error(e);
      // fallback
      const data = await apiFetch('/api/tickets').then(res => res.json());
      setTickets(data.data || []);
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    if (p === 'medium') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Helpdesk & Support</h2>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-[min(var(--radius-md),12px)] border border-transparent text-sm transition-all focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 group/button shrink-0 bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5 font-semibold">
            <Plus className="w-3.5 h-3.5 mr-1" /> Open Ticket
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold">Subject</label>
                <Input value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} placeholder="Briefly describe the issue" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Priority</label>
                <select 
                  className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTicket.priority} 
                  onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <Button onClick={handleCreate} className="w-full">Submit Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Filters Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search ticket ID or subject..." className="pl-9 bg-card" />
            </div>
            <Button variant="outline" className="bg-card">All Tickets</Button>
            <Button variant="outline" className="bg-card text-emerald-500">Resolved</Button>
          </div>

          {/* Table */}
          <div className="border border-border/50 rounded-xl bg-card overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 font-semibold">Ticket</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Priority</th>
                  <th className="px-6 py-3 font-semibold">Requester</th>
                  <th className="px-6 py-3 font-semibold text-right">Age</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{ticket.subject}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">#{ticket.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.status === 'resolved' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 gap-1.5 px-2 py-0.5">
                          <Clock className="w-3 h-3" /> Open
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} uppercase text-[10px] tracking-wider px-2`}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{ticket.user}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                      <div className="flex items-center justify-end gap-3">
                        <span>{ticket.created_at}</span>
                        {ticket.status !== 'resolved' && (
                          <Button onClick={() => handleResolve(ticket.id)} size="sm" variant="ghost" className="h-6 px-2 text-[10px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-600">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">No support tickets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
