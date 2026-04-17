import { Zap, MessagesSquare, Phone, LineChart, BrainCircuit, ScanSearch, CheckCircle2 } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="flex-1 p-4 md:p-6 pt-4 overflow-y-auto">
      <div className="grid gap-4 md:grid-cols-4 auto-rows-[160px] max-w-6xl mx-auto">
        
        {/* TOP BAR: PRICING */}
        <div className="col-span-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-indigo-500/10">
          <div>
            <span className="font-extrabold text-lg tracking-tight">ENTERPRISE PLAN</span>
            <span className="opacity-80 text-xs ml-3 font-medium">Ends in 24 days</span>
          </div>
          <div className="flex gap-5 items-center">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Daily AI Credits</div>
              <div className="h-1.5 w-32 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-white w-[60%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              </div>
              <div className="text-[10px] mt-1.5 font-medium opacity-90">3/5 Image • 45/120s Video</div>
            </div>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-opacity-90 transition-all shadow-sm">
              Upgrade & Save 20%
            </button>
          </div>
        </div>

        {/* UNIFIED INBOX (Span 2x2) */}
        <div className="md:col-span-2 md:row-span-2 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center justify-center gap-2">
              <MessagesSquare className="w-4 h-4" /> Unified Inbox
            </div>
            <span className="text-[11px] font-medium text-success flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success"></div> 12 New
            </span>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            {[
              { name: 'Marco Rossi', time: '2m', msg: "AI Reply: I've scheduled your demo...", color: 'bg-[#25D366]', channel: 'WA' },
              { name: 'Crypto Partner', time: '15m', msg: 'Proposal attached regarding Q4...', color: 'bg-[#0088cc]', channel: 'TG' },
              { name: 'Sarah Jenkins', time: '1h', msg: 'Pending ticket #8292 support...', color: 'bg-[#EA4335]', channel: 'EM' }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-2.5 rounded-lg bg-white/5 border border-border/50 hover:bg-white/10 transition-colors cursor-pointer">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${item.color} shadow-sm`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-semibold text-foreground truncate">{item.name}</span>
                    <span className="text-muted-foreground">{item.time}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{item.msg}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 text-[11px] text-primary font-semibold text-center cursor-pointer hover:underline">
            Open Full Communication Hub
          </div>
        </div>

        {/* AI ENGINES (Span 2x1) */}
        <div className="md:col-span-2 md:row-span-1 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI Strategy Engines
            </div>
            <div className="text-[10px] text-muted-foreground">12 Engines Running</div>
          </div>
          <div className="grid grid-cols-2 gap-2 h-full content-start">
            {['Growth', 'Revenue', 'Funnel', 'Viral'].map(engine => (
              <div key={engine} className="bg-background border border-border/60 p-2.5 rounded-lg text-[11px] flex items-center justify-start gap-2.5 font-medium text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(99,102,241,0.8)]"></div>
                {engine}
              </div>
            ))}
          </div>
        </div>

        {/* CALL CENTER WALLBOARD (Span 1x2) */}
        <div className="md:col-span-1 md:row-span-2 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Call Center
            </div>
            <span className="text-[10px] font-extrabold text-destructive flex items-center gap-1 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div> LIVE
            </span>
          </div>
          <div className="text-center py-4 bg-background/50 rounded-lg mb-3 border border-border/30">
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">04</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">Waiting in Queue</div>
          </div>
          <div className="flex flex-col gap-2.5 text-xs flex-1">
            <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Active Calls</span><span className="font-bold">12</span></div>
            <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Avg Wait</span><span className="font-bold">0:45</span></div>
            <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">SLA</span><span className="font-bold text-success">98%</span></div>
          </div>
          <button className="mt-auto w-full bg-primary/10 border border-primary/30 text-primary py-2 rounded-lg text-[11px] font-semibold hover:bg-primary/20 transition-colors">
            Launch Softphone UI
          </button>
        </div>

        {/* PIPELINE / LEADS (Span 1x2) */}
        <div className="md:col-span-1 md:row-span-2 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex items-center mb-4">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-1.5">
              <LineChart className="w-3.5 h-3.5" /> Pipeline Value
            </div>
          </div>
          <div className="text-3xl font-extrabold text-foreground tracking-tight mb-6">$142,500</div>
          <div className="flex-1 flex flex-col gap-4 justify-center">
            <div>
              <div className="flex justify-between text-[10px] mb-1.5 font-medium"><span className="text-muted-foreground">Awareness</span><span className="text-foreground">45%</span></div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{width: '45%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1.5 font-medium"><span className="text-muted-foreground">Decision</span><span className="text-foreground">12%</span></div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full bg-warning rounded-full" style={{width: '12%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1.5 font-medium"><span className="text-muted-foreground">Closed Won</span><span className="text-foreground">28%</span></div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full bg-success rounded-full" style={{width: '28%'}}></div></div>
            </div>
          </div>
        </div>

        {/* SCANNING INTELLIGENCE (Span 2x1) */}
        <div className="md:col-span-2 md:row-span-1 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-2">
              <ScanSearch className="w-4 h-4" /> Intelligence Scanning
            </div>
            <div className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 bg-success/20 text-success rounded flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Syncing
            </div>
          </div>
          <div className="flex gap-6 items-center h-full">
            <div className="flex-1 border-r border-border/50">
              <div className="text-[11px] text-muted-foreground font-medium mb-1">Sources Scanned</div>
              <div className="text-lg font-bold text-foreground">1,402 <span className="opacity-50 text-xs font-medium">Chunks</span></div>
            </div>
            <div className="flex-[1.5] text-[11px]">
              <div className="text-muted-foreground font-medium mb-1 truncate">Latest: <span className="text-foreground">competitor-analysis-v2.pdf</span></div>
              <div className="text-primary font-semibold flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                Updating Knowledge Base...
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
