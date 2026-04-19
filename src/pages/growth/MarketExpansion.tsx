import { Globe, MapPin } from 'lucide-react';

export function MarketExpansion() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="text-emerald-500" /> Market Expansion
          </h2>
          <p className="text-muted-foreground mt-2">Identify cross-border TAM, localization readiness, and multi-currency frameworks.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <MapPin className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Generating regional penetration velocity models...</p>
        </div>
      </div>
    </div>
  );
}
