import { Search, Map } from 'lucide-react';

export function CompetitorIntel() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="text-indigo-500" /> Competitor Intelligence
          </h2>
          <p className="text-muted-foreground mt-2">Track competitor maneuvers, ad spend, and positioning strategies.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm text-center py-20">
          <Map className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Competitor array mapping in progress. Dashboards generating...</p>
        </div>
      </div>
    </div>
  );
}
