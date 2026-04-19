import { Megaphone, RadioTower } from 'lucide-react';

export function Broadcast() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="text-emerald-500" /> Mass Broadcast System
          </h2>
          <p className="text-muted-foreground mt-2">Execute multi-channel blasts via SMS, push notification, and email simultaneously.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <RadioTower className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Warming up dedicated IP reputation servers...</p>
        </div>
      </div>
    </div>
  );
}
