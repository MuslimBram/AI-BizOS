import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Mail, UserPlus, CheckCircle2, MoreVertical, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticated user
  const authUserStr = localStorage.getItem('auth_user');
  const currentUser = authUserStr ? JSON.parse(authUserStr) : null;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    // Optimistic UI update
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    
    // API Call
    await apiFetch('/api/admin/users/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole })
    });
  };

  if (loading) return <div className="p-10 text-center"><Shield className="w-6 h-6 animate-pulse mx-auto mb-2" />Loading Administration Panel...</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-6 bg-card">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold tracking-tight">Super Admin Panel</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground mr-2 border border-border px-2 py-1 rounded-md bg-muted/30">
            Welcome, {currentUser?.name || "Admin"}
          </span>
          <Button size="sm" className="h-8 shadow-sm">
            <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Invite Member
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-8 h-8 text-indigo-500 mb-3" />
              <div className="font-bold text-2xl">{users.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Total Users</div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-8 h-8 text-rose-500 mb-3" />
              <div className="font-bold text-2xl">{users.filter(u => u.role === 'admin' || u.role === 'owner').length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Staged Admins</div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <Activity className="w-8 h-8 text-emerald-500 mb-3" />
              <div className="font-bold text-2xl">99.9%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Platform Uptime</div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/30 bg-muted/10 font-bold flex justify-between items-center">
              <span>Roles & Access Control</span>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Access Level</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-8 h-8 rounded-full border border-border/50" alt="" />
                        <div>
                          <div className="font-bold text-foreground">{u.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        disabled={u.email === 'muslimani181@gmail.com' && currentUser.email !== 'muslimani181@gmail.com'}
                        className={`text-xs uppercase tracking-wider font-bold rounded px-2 py-1.5 border appearance-none cursor-pointer outline-none ${
                          u.role === 'owner' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' : 
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 
                          'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        <option value="owner" className="bg-background text-foreground uppercase">Owner</option>
                        <option value="admin" className="bg-background text-foreground uppercase">Admin</option>
                        <option value="user" className="bg-background text-foreground uppercase">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 gap-1.5 text-[10px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> {u.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                         <MoreVertical className="w-4 h-4" />
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
