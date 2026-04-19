import { Search, ListChecks } from 'lucide-react';

export function KeywordEngine() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="text-primary" /> Keyword Intelligence Generator
          </h2>
          <p className="text-muted-foreground mt-2">Identify high-converting, low-competition semantic targets.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm text-center py-20">
          <ListChecks className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Syncing historical query strings and competition datasets.</p>
        </div>
      </div>
    </div>
  );
}
