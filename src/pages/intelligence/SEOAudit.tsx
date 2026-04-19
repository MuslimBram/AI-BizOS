import { Globe, Code } from 'lucide-react';

export function SEOAudit() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="text-emerald-500" /> SEO & Technical Audit
          </h2>
          <p className="text-muted-foreground mt-2">Continuous parsing of your domain infrastructure for organic search optimization.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm text-center py-20">
          <Code className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Crawler agents currently analyzing your sitemaps. Awaiting results...</p>
        </div>
      </div>
    </div>
  );
}
