import { Shield, Sparkles } from 'lucide-react';

export function BrandReputation() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-rose-500" /> Brand & Reputation Alerting
          </h2>
          <p className="text-muted-foreground mt-2">Social listening and review aggregation via NLP sentiment tracking.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm text-center py-20">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">NLP nodes are monitoring mentions across web and social topologies...</p>
        </div>
      </div>
    </div>
  );
}
