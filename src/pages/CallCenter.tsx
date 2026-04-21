import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Play, Pause, MoreVertical, LayoutGrid, Clock, PhoneCall, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function CallCenter() {
  const [calls, setCalls] = useState<any[]>([]);
  const [isDialpadOpen, setIsDialpadOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    apiFetch('/api/calls')
      .then(res => res.json())
      .then(data => setCalls(data.data || []));
  }, []);

  const handleSimulateCall = async () => {
    if (!phoneNumber) return;
    setIsCalling(true);
    
    try {
      const res = await apiFetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: phoneNumber, type: 'outbound' })
      });
      const data = await res.json();
      if (data.success) {
        setCalls([data.data, ...calls]);
        setIsDialpadOpen(false);
        setPhoneNumber('');
      }
    } catch(e) {
      console.error("Failed to generate call log", e);
    } finally {
      setIsCalling(false);
    }
  };

  const dialpadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Call Center & WebRTC Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          
          <Dialog open={isDialpadOpen} onOpenChange={setIsDialpadOpen}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-[min(var(--radius-md),12px)] border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm transition-all focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-2.5 font-semibold">
              <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Dialpad
            </DialogTrigger>
            <DialogContent className="sm:max-w-[320px]">
              <DialogHeader>
                <DialogTitle className="text-center">Make a Call</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <Input 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="text-center text-xl tracking-wider h-12 font-semibold bg-muted/50"
                />
                
                <div className="grid grid-cols-3 gap-3 w-full px-4">
                  {dialpadNumbers.map(num => (
                    <button 
                      key={num}
                      onClick={() => setPhoneNumber(prev => prev + num)}
                      className="h-14 rounded-full bg-muted/50 hover:bg-muted text-xl font-medium flex items-center justify-center transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                
                <Button 
                  onClick={handleSimulateCall} 
                  disabled={!phoneNumber || isCalling}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 mt-2 text-white shadow-lg"
                >
                  {isCalling ? <Loader2 className="w-6 h-6 animate-spin" /> : <PhoneCall className="w-6 h-6" />}
                </Button>
                {isCalling && <div className="text-xs text-muted-foreground animate-pulse text-center mt-2">AI is answering and transcribing...</div>}
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
            Available Online
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Quick Stats */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="text-muted-foreground text-xs uppercase font-semibold">Total Calls Today</div>
            <div className="text-3xl font-bold mt-2">124</div>
            <div className="text-xs text-emerald-500 mt-1">+14% from yesterday</div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="text-muted-foreground text-xs uppercase font-semibold">Avg. Duration</div>
            <div className="text-3xl font-bold mt-2">3m 42s</div>
            <div className="text-xs text-emerald-500 mt-1">-12s from yesterday</div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="text-muted-foreground text-xs uppercase font-semibold">Missed Rate</div>
            <div className="text-3xl font-bold mt-2">4.2%</div>
            <div className="text-xs text-rose-500 mt-1">+0.5% needs attention</div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-4">Recent Call Logs (AI Transcribed)</h3>
        
        <div className="space-y-4">
          {calls.map(call => (
            <div key={call.id} className="bg-card border border-border/50 rounded-xl p-5 shadow-sm transition-colors hover:border-primary/50 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${call.type === 'inbound' ? 'bg-blue-500' : call.type === 'outbound' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted`}>
                    {call.type === 'inbound' ? <PhoneIncoming className="w-5 h-5 text-blue-500" /> : 
                     call.type === 'outbound' ? <PhoneOutgoing className="w-5 h-5 text-emerald-500" /> : 
                     <PhoneMissed className="w-5 h-5 text-rose-500" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{call.contact}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3" /> {call.time} • Duration: {call.duration}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {call.duration !== '00:00' && (
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-background">
                      <Play className="w-3 h-3 mr-2 text-primary" /> Play Recording
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {call.transcript && (
                <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Raw Transcript Snippet</div>
                    <p className="text-sm text-foreground/80 italic">"{call.transcript}"</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                      ✨ AI Action Summary
                    </div>
                    <p className="text-sm font-medium text-foreground/90">{call.ai_summary}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
