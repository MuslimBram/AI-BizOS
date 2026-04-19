import { Briefcase, Handshake } from 'lucide-react';

export function Partnerships() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="text-indigo-500" /> B2B Partnerships & Affiliates
          </h2>
          <p className="text-muted-foreground mt-2">Manage partner tiers, commission splits, and automated payouts.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Handshake className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Initializing partner network ledger...</p>
        </div>
      </div>
    </div>
  );
}
