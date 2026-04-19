import { Shield, Search } from 'lucide-react';

export function SourcesScanner() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Search className="text-indigo-500" /> Sources & Scanner
        </h2>
        <div className="bg-card p-8 rounded-2xl border shadow-sm">
          <p className="text-muted-foreground">Global data scanner nodes monitoring integrations and public APIS across tenants.</p>
        </div>
      </div>
    </div>
  );
}
