import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Plus, Megaphone, Users, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('awareness');
  const [message, setMessage] = useState('');

  // Fetch campaigns initially and set up basic polling for "sending" status
  useEffect(() => {
    const fetchCampaigns = () => {
      apiFetch('/api/campaigns')
        .then(res => res.json())
        .then(data => setCampaigns(data.data || []));
    };
    
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async () => {
    if (!name || !message) return;
    setIsSending(true);
    
    try {
      await apiFetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, audience, message })
      });
      
      setIsOpen(false);
      setName('');
      setMessage('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Campaigns & Broadcasts</h1>
          <p className="text-sm text-muted-foreground mt-1">Send messages via WhatsApp and Telegram</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-[min(var(--radius-md),12px)] border border-transparent text-sm transition-all focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 group/button shrink-0 bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-3 font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            New Broadcast
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-border/50 bg-card rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Campaign</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Campaign Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q4 Promo" className="bg-muted/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Target Audience</label>
                <select 
                  value={audience} 
                  onChange={e => setAudience(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="awareness">Awareness (Top of Funnel)</option>
                  <option value="decision">Decision (Hot Leads)</option>
                  <option value="negotiation">Negotiation (Closing)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Message Content</label>
                <textarea 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Hello {{name}}, we have a special offer..." 
                  className="w-full bg-muted/50 border border-border/50 rounded-md p-3 text-sm h-32 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!name || !message || isSending} className="bg-primary gap-2">
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                Blast Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-10">
        {campaigns.map(camp => (
          <div key={camp.id} className="bg-card border border-border/50 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${camp.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : camp.status === 'sending' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {camp.name}
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${camp.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : camp.status === 'sending' ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                    {camp.status}
                  </span>
                </h3>
                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Audience: {camp.audience}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(camp.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground text-xs font-medium">Sent</span>
                <span className="font-bold text-foreground">{camp.sent}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground text-xs font-medium">Opens</span>
                <span className="font-bold text-foreground">{camp.opens}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground text-xs font-medium">Replies</span>
                <span className="font-bold text-foreground">{camp.replies}</span>
              </div>
              
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <CheckCircle2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2 border border-dashed border-border/50 rounded-xl">
            <Megaphone className="w-8 h-8 opacity-20" />
            <p>No campaigns found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
