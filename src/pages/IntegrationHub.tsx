import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Globe, RefreshCw, PowerOff, CheckCircle2, AlertCircle, Settings2, ShieldCheck, Mail, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // WhatsApp Config State
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waConfig, setWaConfig] = useState({ accessToken: '', phoneNumberId: '', verifyToken: '' });
  const [waError, setWaError] = useState<string | null>(null);
  const [waTesting, setWaTesting] = useState(false);

  // Telegram Config State
  const [tgModalOpen, setTgModalOpen] = useState(false);
  const [tgConfig, setTgConfig] = useState({ botToken: '' });
  const [tgError, setTgError] = useState<string | null>(null);
  const [tgTesting, setTgTesting] = useState(false);

  // Email Config State
  const [emModalOpen, setEmModalOpen] = useState(false);
  const [emConfig, setEmConfig] = useState({ apiKey: '', fromEmail: '' });
  const [emError, setEmError] = useState<string | null>(null);
  const [emTesting, setEmTesting] = useState(false);

  // Shopify Config State
  const [shModalOpen, setShModalOpen] = useState(false);
  const [shConfig, setShConfig] = useState({ shopDomain: '', accessToken: '' });
  const [shError, setShError] = useState<string | null>(null);
  const [shTesting, setShTesting] = useState(false);

  // Webchat Config State
  const [wcModalOpen, setWcModalOpen] = useState(false);
  const [wcConfig, setWcConfig] = useState({ allowedDomains: '', widgetId: '' });
  const [wcError, setWcError] = useState<string | null>(null);
  const [wcTesting, setWcTesting] = useState(false);

  useEffect(() => {
    apiFetch('/api/integrations')
      .then(res => res.json())
      .then(data => {
        setIntegrations(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (id: string, currentStatus: string) => {
    if (id === 'int-whatsapp') {
      if (currentStatus === 'connected') {
        const res = await apiFetch('/api/integrations/whatsapp/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: '', phoneNumberId: '', verifyToken: '' })
        });
        const data = await res.json();
        setIntegrations(data.data);
      } else {
        const target = integrations.find(i => i.id === 'int-whatsapp');
        if (target && target.config) {
          setWaConfig({ 
            accessToken: target.config.accessToken || '', 
            phoneNumberId: target.config.phoneNumberId || '', 
            verifyToken: target.config.verifyToken || '' 
          });
        }
        setWaError(null);
        setWaModalOpen(true);
      }
      return;
    }

    if (id === 'int-telegram') {
      if (currentStatus === 'connected') {
        // Disconnect immediately
        const res = await apiFetch('/api/integrations/telegram/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botToken: '', webhookUrl: '' })
        });
        const data = await res.json();
        setIntegrations(data.data);
      } else {
        // Open Modal to configure
        const target = integrations.find(i => i.id === 'int-telegram');
        if (target && target.config) {
          setTgConfig({ botToken: target.config.botToken || '' });
        }
        setTgError(null);
        setTgModalOpen(true);
      }
      return;
    }

    if (id === 'int-email') {
      if (currentStatus === 'connected') {
        const res = await apiFetch('/api/integrations/email/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: '', fromEmail: '' })
        });
        const data = await res.json();
        setIntegrations(data.data);
      } else {
        const target = integrations.find(i => i.id === 'int-email');
        if (target && target.config) {
          setEmConfig({ apiKey: target.config.apiKey || '', fromEmail: target.config.fromEmail || '' });
        }
        setEmError(null);
        setEmModalOpen(true);
      }
      return;
    }

    if (id === 'int-shopify') {
      if (currentStatus === 'connected') {
        const res = await apiFetch('/api/integrations/shopify/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shopDomain: '', accessToken: '' })
        });
        const data = await res.json();
        setIntegrations(data.data);
      } else {
        const target = integrations.find(i => i.id === 'int-shopify');
        if (target && target.config) {
          setShConfig({ shopDomain: target.config.shopDomain || '', accessToken: target.config.accessToken || '' });
        }
        setShError(null);
        setShModalOpen(true);
      }
      return;
    }

    if (id === 'int-webchat') {
      if (currentStatus === 'connected') {
        const res = await apiFetch('/api/integrations/webchat/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ allowedDomains: '' })
        });
        const data = await res.json();
        setIntegrations(data.data);
      } else {
        const target = integrations.find(i => i.id === 'int-webchat');
        if (target && target.config) {
          setWcConfig({ allowedDomains: target.config.allowedDomains || '', widgetId: target.config.widgetId || '' });
        }
        setWcError(null);
        setWcModalOpen(true);
      }
      return;
    }

    const res = await apiFetch('/api/integrations/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      setIntegrations(data.data);
    }
  };

  const handleTestWhatsApp = async () => {
    setWaTesting(true);
    setWaError(null);
    try {
      const res = await apiFetch('/api/integrations/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waConfig)
      });
      const data = await res.json();
      
      setIntegrations(data.data); // Update with new status/errors
      
      if (!data.success) {
        setWaError(data.error || 'Failed to connect. Verify your tokens.');
      } else {
        setWaModalOpen(false); // Close on success
      }
    } catch(e) {
      setWaError('Network error connecting to verification server.');
    } finally {
      setWaTesting(false);
    }
  };

  const handleTestTelegram = async () => {
    setTgTesting(true);
    setTgError(null);
    try {
      const res = await apiFetch('/api/integrations/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: tgConfig.botToken,
          webhookUrl: `${window.location.origin}/api/webhooks/telegram`
        })
      });
      const data = await res.json();
      
      setIntegrations(data.data); 
      
      if (!data.success) {
        setTgError(data.error || 'Failed to connect. Verify your Bot Token.');
      } else {
        setTgModalOpen(false);
      }
    } catch(e) {
      setTgError('Network error connecting to verification server.');
    } finally {
      setTgTesting(false);
    }
  };

  const handleTestEmail = async () => {
    setEmTesting(true);
    setEmError(null);
    try {
      const res = await apiFetch('/api/integrations/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emConfig)
      });
      const data = await res.json();
      
      setIntegrations(data.data); 
      
      if (!data.success) {
        setEmError(data.error || 'Failed to connect. Verify your API Key.');
      } else {
        setEmModalOpen(false);
      }
    } catch(e) {
      setEmError('Network error connecting to verification server.');
    } finally {
      setEmTesting(false);
    }
  };

  const handleTestShopify = async () => {
    setShTesting(true);
    setShError(null);
    try {
      const res = await apiFetch('/api/integrations/shopify/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shConfig)
      });
      const data = await res.json();
      
      setIntegrations(data.data);
      
      if (!data.success) {
        setShError(data.error || 'Failed to connect to Shopify Store.');
      } else {
        setShModalOpen(false);
      }
    } catch(e) {
      setShError('Network error connecting to Shopify app.');
    } finally {
      setShTesting(false);
    }
  };

  const handleTestWebchat = async () => {
    setWcTesting(true);
    setWcError(null);
    try {
      const res = await apiFetch('/api/integrations/webchat/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wcConfig)
      });
      const data = await res.json();
      
      setIntegrations(data.data);
      
      if (!data.success) {
        setWcError(data.error || 'Failed to provision logic.');
      } else {
        setWcConfig({...wcConfig, widgetId: data.widgetId});
        setWcModalOpen(false);
      }
    } catch(e) {
      setWcError('Network error connecting to local server.');
    } finally {
      setWcTesting(false);
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
                      ) : int.status === 'error' ? (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-2 py-0.5 gap-1.5 uppercase text-[10px] tracking-wider" title={int.lastError}>
                          <AlertCircle className="w-3 h-3" /> Error
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-border px-2 py-0.5 gap-1.5 uppercase text-[10px] tracking-wider">
                          <PowerOff className="w-3 h-3" /> Offline
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                       {int.id === 'int-whatsapp' && int.status === 'error' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-rose-500" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Fix Setup
                         </Button>
                       )}
                       {int.id === 'int-whatsapp' && int.status === 'connected' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-600" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Configure
                         </Button>
                       )}
                       {int.id === 'int-telegram' && int.status === 'error' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-rose-500" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Fix Setup
                         </Button>
                       )}
                       {int.id === 'int-telegram' && int.status === 'connected' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-600" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Configure
                         </Button>
                       )}
                       {int.id === 'int-email' && int.status === 'error' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-rose-500" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Fix Setup
                         </Button>
                       )}
                       {int.id === 'int-email' && int.status === 'connected' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-600" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Configure
                         </Button>
                       )}
                       {int.id === 'int-shopify' && int.status === 'error' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-rose-500" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Fix Setup
                         </Button>
                       )}
                       {int.id === 'int-shopify' && int.status === 'connected' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-600" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Configure
                         </Button>
                       )}
                       {int.id === 'int-webchat' && int.status === 'connected' && (
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-600" onClick={() => handleToggle(int.id, 'disconnected')}>
                           <Settings2 className="w-4 h-4 mr-1" /> Configure
                         </Button>
                       )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggle(int.id, int.status)}
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
      
      {/* WhatsApp Configuration Modal */}
      <Dialog open={waModalOpen} onOpenChange={setWaModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#25D366]" /> Meta WhatsApp setup
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            
            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3">
               <h4 className="text-sm font-semibold flex items-center gap-2"><Settings2 className="w-4 h-4"/> 1. Webhook Configuration</h4>
               <p className="text-xs text-muted-foreground">Copy these values into your Meta Developer App dashboard under WhatsApp &gt; Configuration.</p>
               
               <div className="space-y-1 relative">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Callback URL</label>
                 <Input readOnly value={`${window.location.origin}/api/webhooks/whatsapp`} className="bg-background text-xs font-mono h-8" />
               </div>
               
               <div className="space-y-1 relative">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Verify Token</label>
                 <Input readOnly value={waConfig.verifyToken || 'wa_biz_secure_88'} className="bg-background text-xs font-mono h-8" />
               </div>
            </div>

            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3 mt-4">
               <h4 className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> 2. Authentication Tokens</h4>
               <p className="text-xs text-muted-foreground">Retrieve these from your Meta Dashboard under WhatsApp &gt; API Setup.</p>
               
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">System User Access Token</label>
                 <Input 
                   type="password" 
                   value={waConfig.accessToken} 
                   onChange={(e) => setWaConfig({...waConfig, accessToken: e.target.value})}
                   placeholder="EAAI..." 
                   className="bg-background text-xs h-8" 
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Phone Number ID</label>
                 <Input 
                   value={waConfig.phoneNumberId} 
                   onChange={(e) => setWaConfig({...waConfig, phoneNumberId: e.target.value})}
                   placeholder="104XXXX..." 
                   className="bg-background text-xs font-mono h-8" 
                 />
               </div>
            </div>

            {waError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-xs flex gap-2 items-start mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Connection Failed:</strong> {waError}. Ensure tokens are correct and the phone number ID is valid.</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
               <Button variant="outline" onClick={() => setWaModalOpen(false)}>Cancel</Button>
               <Button onClick={handleTestWhatsApp} disabled={waTesting || !waConfig.accessToken || !waConfig.phoneNumberId} className="bg-[#25D366] hover:bg-[#1DA851] text-white">
                 {waTesting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                 Test & Connect
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Telegram Configuration Modal */}
      <Dialog open={tgModalOpen} onOpenChange={setTgModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#0088cc]" /> Telegram Bot setup
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            
            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3">
               <h4 className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> API Connection</h4>
               <p className="text-xs text-muted-foreground">Talk to <b>@BotFather</b> on Telegram to create a new bot and obtain your HTTP API Token.</p>
               
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Bot API Token</label>
                 <Input 
                   type="password" 
                   value={tgConfig.botToken} 
                   onChange={(e) => setTgConfig({botToken: e.target.value})}
                   placeholder="1234567890:AAH_XxXxXxXxXxXxXxXxXx" 
                   className="bg-background text-xs font-mono h-8" 
                 />
               </div>
            </div>

            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3 mt-4">
               <h4 className="text-sm font-semibold flex items-center gap-2"><Settings2 className="w-4 h-4"/> Automating Webhooks</h4>
               <p className="text-xs text-muted-foreground">Our platform will automatically securely bind the Telegram Webhook to your host origin. We will dispatch messages instantly.</p>
               
               <div className="space-y-1 relative">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Callback URL (Auto-Bound)</label>
                 <Input disabled value={`${window.location.origin}/api/webhooks/telegram`} className="bg-background text-xs font-mono h-8 opacity-70" />
               </div>
            </div>

            {tgError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-xs flex gap-2 items-start mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Connection Failed:</strong> {tgError}. Ensure your token is valid from BotFather.</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
               <Button variant="outline" onClick={() => setTgModalOpen(false)}>Cancel</Button>
               <Button onClick={handleTestTelegram} disabled={tgTesting || !tgConfig.botToken} className="bg-[#0088cc] hover:bg-[#0077b3] text-white">
                 {tgTesting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                 Test & Connect
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Configuration Modal */}
      <Dialog open={emModalOpen} onOpenChange={setEmModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" /> SendGrid Email integration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3">
               <h4 className="text-sm font-semibold flex items-center gap-2"><Settings2 className="w-4 h-4"/> 1. Sender Configuration</h4>
               <p className="text-xs text-muted-foreground">Setup the email address you'll send from and receive replies to in your SendGrid dashboard.</p>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Verified Sender Email</label>
                 <Input 
                   value={emConfig.fromEmail} 
                   onChange={(e) => setEmConfig({...emConfig, fromEmail: e.target.value})}
                   placeholder="support@yourcompany.com" 
                   className="bg-background text-xs h-8" 
                 />
               </div>
               <div className="space-y-1 mt-2">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Inbound Parse Webhook</label>
                 <Input readOnly value={`${window.location.origin}/api/webhooks/email`} className="bg-background text-xs font-mono h-8 opacity-70" />
               </div>
            </div>

            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3 mt-4">
               <h4 className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> 2. SendGrid API Key</h4>
               <p className="text-xs text-muted-foreground">Generate a Restricted API Key from SendGrid with "Mail Send" permissions.</p>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">REST API Key</label>
                 <Input 
                   type="password" 
                   value={emConfig.apiKey} 
                   onChange={(e) => setEmConfig({...emConfig, apiKey: e.target.value})}
                   placeholder="SG.xxxxxxxx.yyyyyyyy" 
                   className="bg-background text-xs h-8" 
                 />
               </div>
            </div>

            {emError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-xs flex gap-2 items-start mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Connection Failed:</strong> {emError}. Ensure your SendGrid API key is correct and valid.</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
               <Button variant="outline" onClick={() => setEmModalOpen(false)}>Cancel</Button>
               <Button onClick={handleTestEmail} disabled={emTesting || !emConfig.apiKey || !emConfig.fromEmail} className="bg-blue-600 hover:bg-blue-700 text-white">
                 {emTesting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                 Test & Connect
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Shopify Configuration Modal */}
      <Dialog open={shModalOpen} onOpenChange={setShModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#95bf47]" /> Shopify integration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3">
               <h4 className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Store Connection</h4>
               <p className="text-xs text-muted-foreground">Ensure you have generated a custom app in Shopify store settings with necessary Admin API Access.</p>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Shop Domain</label>
                 <Input 
                   value={shConfig.shopDomain} 
                   onChange={(e) => setShConfig({...shConfig, shopDomain: e.target.value})}
                   placeholder="yourstore.myshopify.com" 
                   className="bg-background text-xs h-8" 
                 />
               </div>
               <div className="space-y-1 mt-2">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Admin API Access Token</label>
                 <Input 
                   type="password" 
                   value={shConfig.accessToken} 
                   onChange={(e) => setShConfig({...shConfig, accessToken: e.target.value})}
                   placeholder="shpat_..." 
                   className="bg-background text-xs h-8" 
                 />
               </div>
            </div>

            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3 mt-4">
               <h4 className="text-sm font-semibold flex items-center gap-2"><Settings2 className="w-4 h-4"/> Webhook Subscriptions</h4>
               <p className="text-xs text-muted-foreground">Register this URL in Shopify notifications to receive updates (orders, customers, etc).</p>
               <div className="space-y-1 relative">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Webhook URL</label>
                 <Input readOnly value={`${window.location.origin}/api/webhooks/shopify`} className="bg-background text-xs font-mono h-8 opacity-70" />
               </div>
            </div>

            {shError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-xs flex gap-2 items-start mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Connection Failed:</strong> {shError}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
               <Button variant="outline" onClick={() => setShModalOpen(false)}>Cancel</Button>
               <Button onClick={handleTestShopify} disabled={shTesting || !shConfig.accessToken || !shConfig.shopDomain} className="bg-[#95bf47] hover:bg-[#83a83d] text-white">
                 {shTesting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                 Test & Connect
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Webchat Configuration Modal */}
      <Dialog open={wcModalOpen} onOpenChange={setWcModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" /> Webchat Widget
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-3">
               <h4 className="text-sm font-semibold flex items-center gap-2"><Globe className="w-4 h-4"/> Allowed Domains</h4>
               <p className="text-xs text-muted-foreground">Specify the domain(s) allowed to embed and initiate this webchat session.</p>
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Domain (CORS)</label>
                 <Input 
                   value={wcConfig.allowedDomains} 
                   onChange={(e) => setWcConfig({...wcConfig, allowedDomains: e.target.value})}
                   placeholder="https://yourwebsite.com" 
                   className="bg-background text-xs h-8" 
                 />
               </div>
            </div>

            {wcConfig.widgetId && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl space-y-3 mt-4">
                 <h4 className="text-sm font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400"><Settings2 className="w-4 h-4"/> Widget Installation</h4>
                 <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80">Copy this exact code snippet into the <code>&lt;head&gt;</code> of your website.</p>
                 <div className="space-y-1 relative">
                   <textarea 
                     readOnly 
                     className="w-full bg-background/50 border border-indigo-500/30 text-xs font-mono rounded-lg p-3 outline-none"
                     rows={3}
                     value={`<script src="${window.location.origin}/widget.js" data-widget-id="${wcConfig.widgetId}"></script>`}
                   />
                 </div>
              </div>
            )}

            {wcError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-xs flex gap-2 items-start mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Config Failed:</strong> {wcError}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
               <Button variant="outline" onClick={() => setWcModalOpen(false)}>Cancel</Button>
               <Button onClick={handleTestWebchat} disabled={wcTesting || !wcConfig.allowedDomains} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 {wcTesting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                 {wcConfig.widgetId ? 'Update Config' : 'Generate & Connect'}
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
