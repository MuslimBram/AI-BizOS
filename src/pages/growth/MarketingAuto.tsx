import { Megaphone, Mail } from 'lucide-react';

export function MarketingAuto() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="text-indigo-500" /> Marketing Automation
          </h2>
          <p className="text-muted-foreground mt-2">Drip campaigns, email nurture sequences, and omnichannel remarketing.</p>
        </div>
        <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Mail className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Initializing email delivery infrastructure...</p>
        </div>
      </div>
    </div>
  );
}
