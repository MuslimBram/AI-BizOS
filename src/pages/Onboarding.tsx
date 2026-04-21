import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Building2, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export function Onboarding() {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      const res = await apiFetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, industry })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('active_workspace_id', data.workspace.id);
        navigate('/');
        window.location.reload(); // Refresh context
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-xl border border-border/50 overflow-hidden">
        <div className="bg-primary/5 p-8 text-center border-b border-border/50">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
             <Building2 className="w-8 h-8 text-primary" />
             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center text-white shadow-sm border-2 border-background">
               <Zap className="w-3 h-3" />
             </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to AI BizOS</h1>
          <p className="text-muted-foreground text-sm">Let's set up your business workspace to get started with the autonomous suite.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business / Workspace Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry <span className="text-muted-foreground">(Optional)</span></label>
              <select 
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="">Select Industry</option>
                <option value="eCommerce">eCommerce</option>
                <option value="SaaS">SaaS & Software</option>
                <option value="Agency">Agency & Services</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-primary text-primary-foreground font-semibold h-11 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isCreating ? 'Provisioning Environment...' : 'Create Workspace'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center">
               <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> End-to-end encrypted infrastructure</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
