import { useState, useEffect } from 'react';
import { Settings, Save, Globe, Shield, Activity, User, Building2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function WorkspaceSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data.data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    // Mock short delay for UI
    setTimeout(() => setSaving(false), 500);
  };

  if (loading || !settings) return <div className="p-8 text-center text-muted-foreground">Loading workspace details...</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Workspace Settings</h2>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-8 rounded-lg shadow-sm">
          {saving ? 'Saving...' : <><Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes</>}
        </Button>
      </div>

      <div className="flex-1 overflow-auto flex">
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-border/50 bg-muted/10 p-4 shrink-0 hidden md:block">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary transition-colors">
              <Building2 className="w-4 h-4" /> Workspace Profile
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <User className="w-4 h-4" /> Team & Roles
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <Globe className="w-4 h-4" /> Domains
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <Shield className="w-4 h-4" /> Security & Identity
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <Activity className="w-4 h-4" /> Audit Logs
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 lg:p-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Business Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your workspace identity, regional settings, and operational preferences.</p>
          </div>

          <div className="space-y-8">
            {/* Identity */}
            <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Workspace Name</label>
                  <Input 
                    value={settings.workspaceName} 
                    onChange={e => setSettings({...settings, workspaceName: e.target.value})}
                    className="bg-background"
                  />
                  <p className="text-[10px] text-muted-foreground">This is your company's visible name across the platform.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Industry Validation</label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.industry} 
                    onChange={e => setSettings({...settings, industry: e.target.value})}
                  >
                    <option value="SaaS">SaaS & Technology</option>
                    <option value="Ecommerce">E-Commerce</option>
                    <option value="Agency">Agency</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Infrastructure Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Primary Custom Domain</label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground sm:text-sm">
                      https://
                    </span>
                    <Input 
                      value={settings.domain} 
                      onChange={e => setSettings({...settings, domain: e.target.value})}
                      className="rounded-l-none bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Operational Timezone</label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.timezone} 
                    onChange={e => setSettings({...settings, timezone: e.target.value})}
                  >
                    <option value="UTC">UTC (Global)</option>
                    <option value="America/New_York">EST (New York)</option>
                    <option value="America/Los_Angeles">PST (Los Angeles)</option>
                    <option value="Europe/London">GMT (London)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Access */}
            <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Security & Access</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Allow Public Signups</div>
                  <div className="text-xs text-muted-foreground mt-1">Enable open registration on your specific workspace domain.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.allowSignups}
                    onChange={e => setSettings({...settings, allowSignups: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
