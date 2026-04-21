import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { CreditCard, Zap, CheckCircle2, Download, AlertCircle, TrendingUp, Users, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function Billing() {
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  useEffect(() => {
    apiFetch('/api/billing')
      .then(res => res.json())
      .then(data => {
        setBilling(data.data);
        setLoading(false);
      });
  }, []);

  const handlePlanChange = async (newPlan: string) => {
    const isUpgrade = newPlan === 'enterprise_plus';
    const res = await apiFetch(`/api/billing/${isUpgrade ? 'upgrade' : 'downgrade'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPlan })
    });
    
    const data = await res.json();
    if (data.success) {
      setBilling(data.data);
      setUpgradeDialogOpen(false);
    }
  };

  if (loading || !billing) return <div className="p-8 text-muted-foreground flex items-center justify-center h-full">Loading Billing Profile...</div>;

  const usagePercent = (used: number, limit: number) => Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Billing & Workspaces</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Current Plan Card */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-[2] bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Plan</div>
                  <h3 className="text-2xl font-extrabold capitalize text-foreground">{billing.plan.replace('_', ' ')}</h3>
                  <div className="text-sm text-success mt-1 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Active & Good Standing</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold tracking-tight">${billing.plan === 'starter' ? '49' : billing.plan === 'enterprise' ? '249' : '899'}</div>
                  <div className="text-xs text-muted-foreground">/{billing.billing_cycle}</div>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between border border-border/40">
                <div className="text-sm">
                  <span className="text-muted-foreground">Next billing date: </span>
                  <span className="font-semibold text-foreground">{new Date(billing.renewal_date).toLocaleDateString()}</span>
                </div>
                
                <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                  <DialogTrigger className="inline-flex items-center justify-center rounded-lg border border-transparent text-sm transition-all focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 group/button shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-2.5">
                    <Zap className="w-3.5 h-3.5 mr-1.5" /> Manage Plan
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Manage Subscription</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                      
                      {/* Starter */}
                      <div className={`border rounded-xl p-5 ${billing.plan === 'starter' ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'}`}>
                        <div className="text-sm font-bold uppercase tracking-wider mb-2">Starter</div>
                        <div className="text-4xl font-extrabold mb-4">$49</div>
                        <ul className="text-sm space-y-2 text-muted-foreground mb-6">
                          <li>• 5,000 Contacts</li>
                          <li>• 50,000 AI Words</li>
                          <li>• Basic Reporting</li>
                        </ul>
                        <Button 
                          variant={billing.plan === 'starter' ? 'outline' : 'default'} 
                          className="w-full" 
                          disabled={billing.plan === 'starter'}
                          onClick={() => handlePlanChange('starter')}
                        >
                          {billing.plan === 'starter' ? 'Current Plan' : 'Downgrade'}
                        </Button>
                      </div>

                      {/* Enterprise */}
                      <div className={`border rounded-xl p-5 ${billing.plan === 'enterprise' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-border/50'} relative overflow-hidden`}>
                        {billing.plan === 'enterprise' && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase font-bold py-1 px-3 rounded-bl-lg">Current</div>}
                        <div className="text-sm font-bold uppercase tracking-wider mb-2 text-indigo-500">Enterprise</div>
                        <div className="text-4xl font-extrabold mb-4">$249</div>
                        <ul className="text-sm space-y-2 text-muted-foreground mb-6">
                          <li>• 50,000 Contacts</li>
                          <li>• 500,000 AI Words</li>
                          <li>• Advanced Workflows</li>
                        </ul>
                        <Button 
                          variant="outline" 
                          className={`w-full ${billing.plan === 'enterprise' ? 'border-indigo-500 text-indigo-500' : ''}`}
                          disabled={billing.plan === 'enterprise'}
                          onClick={() => handlePlanChange('enterprise')}
                        >
                          {billing.plan === 'enterprise' ? 'Current Plan' : (billing.plan === 'starter' ? 'Upgrade' : 'Downgrade')}
                        </Button>
                      </div>

                      {/* Enterprise Plus */}
                      <div className={`border rounded-xl p-5 bg-foreground text-background ${billing.plan === 'enterprise_plus' ? 'ring-2 ring-foreground/20' : ''}`}>
                        <div className="text-sm font-bold uppercase tracking-wider mb-2 text-primary">Enterprise Plus</div>
                        <div className="text-4xl font-extrabold mb-4">$899</div>
                        <ul className="text-sm space-y-2 opacity-80 mb-6">
                          <li>• 250,000 Contacts</li>
                          <li>• 2,000,000 AI Words</li>
                          <li>• Custom Integrations</li>
                        </ul>
                        <Button 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={billing.plan === 'enterprise_plus'}
                          onClick={() => handlePlanChange('enterprise_plus')}
                        >
                          {billing.plan === 'enterprise_plus' ? 'Current Plan' : 'Upgrade to Plus'}
                        </Button>
                      </div>

                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* AI Credit Usage Mini */}
            <div className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <Sparkles className="w-4 h-4" /> AI Credit Usage 
                </div>
                <div className="text-[11px] text-muted-foreground">Resets in 24 days</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-foreground">{billing.usage.ai_words.used.toLocaleString()}</div>
                <div className="text-sm font-medium text-foreground/70 mb-2">/ {billing.usage.ai_words.limit.toLocaleString()} Words</div>
                <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${usagePercent(billing.usage.ai_words.used, billing.usage.ai_words.limit) > 85 ? 'bg-destructive' : 'bg-primary'}`} 
                    style={{ width: `${usagePercent(billing.usage.ai_words.used, billing.usage.ai_words.limit)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Metrics Grid */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">Workspace Utilization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-sm flex items-center gap-1.5"><Users className="w-4 h-4 text-muted-foreground" /> Team Members</div>
                  <div className="text-xs font-bold">{billing.usage.team_members.used} / {billing.usage.team_members.limit}</div>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${usagePercent(billing.usage.team_members.used, billing.usage.team_members.limit)}%` }}></div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-sm flex items-center gap-1.5"><Database className="w-4 h-4 text-muted-foreground" /> CRM Contacts</div>
                  <div className="text-xs font-bold">{billing.usage.contacts.used.toLocaleString()} / {billing.usage.contacts.limit.toLocaleString()}</div>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${usagePercent(billing.usage.contacts.used, billing.usage.contacts.limit)}%` }}></div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-sm flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-muted-foreground" /> Sent Emails</div>
                  <div className="text-xs font-bold">{billing.usage.monthly_emails.used.toLocaleString()} / {billing.usage.monthly_emails.limit.toLocaleString()}</div>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${usagePercent(billing.usage.monthly_emails.used, billing.usage.monthly_emails.limit)}%` }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Invoices List */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Invoice History</h3>
            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-left">Invoice ID</th>
                    <th className="px-6 py-3 font-semibold text-left">Date</th>
                    <th className="px-6 py-3 font-semibold text-left">Amount</th>
                    <th className="px-6 py-3 font-semibold text-left">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {billing.invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{inv.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold">${inv.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 uppercase tracking-wide text-[10px]">
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
