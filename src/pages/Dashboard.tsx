import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Zap, MessagesSquare, Phone, LineChart, BrainCircuit, ScanSearch, CheckCircle2, Megaphone, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: '$145,231',
    pipelineValue: '$0',
    activeLeads: 0,
    unreadMessages: 0,
    activeCampaigns: 0,
    growthRate: '+0%',
    mrr: '$0'
  });

  useEffect(() => {
    apiFetch('/api/dashboard/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setMetrics(data.data);
        }
      })
      .catch(console.error);
  }, []);

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
              <div className="w-1.5 h-1.5 rounded-full bg-success"></div> {metrics.unreadMessages} New
            </span>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="text-sm font-medium">You have <span className="text-primary font-bold">{metrics.unreadMessages}</span> unread conversations waiting for your action.</div>
            <div className="text-xs text-muted-foreground mt-2">Connecting to live inbox pipeline...</div>
          </div>
          <Link to="/inbox" className="mt-4 pt-3 border-t border-border/50 text-[11px] text-primary font-semibold text-center cursor-pointer hover:underline block">
            Open Full Communication Hub
          </Link>
        </div>

        {/* REVENUE ENGINE (Span 2x1) */}
        <div className="md:col-span-2 md:row-span-1 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
           <div className="flex justify-between items-center mb-3">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-2">
              <Zap className="w-4 h-4" /> Revenue Engine
            </div>
            <div className="text-[10px] text-muted-foreground">{metrics.growthRate} Growth</div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full content-center">
             <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">Total Revenue</div>
                <div className="text-xl font-bold text-foreground tracking-tight">{metrics.totalRevenue}</div>
             </div>
             <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">Monthly Recurring</div>
                <div className="text-xl font-bold text-foreground tracking-tight">{metrics.mrr}</div>
             </div>
          </div>
        </div>

        {/* CAMPAIGNS (Span 1x2) */}
        <div className="md:col-span-1 md:row-span-2 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" /> Campaigns
            </div>
          </div>
          <div className="text-center py-4 bg-background/50 rounded-lg mb-3 border border-border/30">
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">{metrics.activeCampaigns}</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">Active Broadcasts</div>
          </div>
          <Link to="/campaigns" className="mt-auto w-full bg-primary/10 border border-primary/30 text-primary py-2 text-center block rounded-lg text-[11px] font-semibold hover:bg-primary/20 transition-colors">
            Manage Broadcasts
          </Link>
        </div>

        {/* PIPELINE / LEADS (Span 1x2) */}
        <div className="md:col-span-1 md:row-span-2 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-1.5">
              <LineChart className="w-3.5 h-3.5" /> Pipeline Value
            </div>
            <div className="text-[10px] text-muted-foreground font-bold">{metrics.activeLeads} Leads</div>
          </div>
          <div className="text-3xl font-extrabold text-foreground tracking-tight mb-6">{metrics.pipelineValue}</div>
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

        {/* AI ENGINES (Span 2x1) */}
        <div className="md:col-span-2 md:row-span-1 rounded-[12px] border bg-card text-card-foreground shadow-sm flex flex-col p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.02em] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI Strategy Engines
            </div>
            <div className="text-[10px] text-muted-foreground">Active</div>
          </div>
          <div className="grid grid-cols-2 gap-2 h-full content-start">
            {['Growth Analyst', 'Conversational AI', 'CRM Strategist', 'Forecast Engine'].map(engine => (
              <div key={engine} className="bg-background border border-border/60 p-2.5 rounded-lg text-[11px] flex items-center justify-start gap-2.5 font-medium text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(99,102,241,0.8)]"></div>
                {engine}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
