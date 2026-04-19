import { useState, useEffect } from 'react';
import { Globe, RefreshCw, PowerOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/integrations')
      .then(res => res.json())
      .then(data => {
        setIntegrations(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (id: string) => {
    const res = await fetch('/api/integrations/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      setIntegrations(data.data);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center text-muted-foreground"><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading Integrations...</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Integration Hub</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Connected Systems</h1>
            <p className="text-sm text-muted-foreground">Manage data piping and API bridges connecting external platforms into your workspace.</p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Provider</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Last Sync</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {integrations.map(int => (
                  <tr key={int.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{int.provider}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{int.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground text-xs">{int.last_sync}</span>
                    </td>
                    <td className="px-6 py-4">
                      {int.status === 'connected' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 gap-1.5 uppercase text-[10px] tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-border px-2 py-0.5 gap-1.5 uppercase text-[10px] tracking-wider">
                          <PowerOff className="w-3 h-3" /> Offline
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggle(int.id)}
                        className={int.status === 'connected' ? 'text-destructive hover:bg-destructive/10 border-border' : 'text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20 bg-emerald-500/5'}
                      >
                        {int.status === 'connected' ? 'Disconnect' : 'Connect API'}
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
  );
}
