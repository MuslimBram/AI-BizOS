import { User, Shield } from 'lucide-react';

export function IntegrationAccounts() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="text-emerald-500" /> Connected Accounts
          </h2>
          <p className="text-muted-foreground mt-2">Manage OAuth tokens, service accounts, and linked identity providers.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Verifying active scopes and permissions...</p>
        </div>
      </div>
    </div>
  );
}
