import { Settings, Terminal } from 'lucide-react';

export function DeveloperSettings() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="text-emerald-500" /> Developer Portal
          </h2>
          <p className="text-muted-foreground mt-2">Manage OAuth Apps, create sandbox environments, and review integration health logs.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Terminal className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Booting developer runtime sandboxes...</p>
        </div>
      </div>
    </div>
  );
}
