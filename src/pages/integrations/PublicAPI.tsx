import { Database, Code } from 'lucide-react';

export function PublicAPI() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="text-rose-500" /> Public API Configuration
          </h2>
          <p className="text-muted-foreground mt-2">Manage API keys, rate limits, and webhook endpoint subscriptions.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Code className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Generating Swagger UI endpoints for your sandbox...</p>
        </div>
      </div>
    </div>
  );
}
