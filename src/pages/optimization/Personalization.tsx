import { User, Sparkles, Filter, Users } from 'lucide-react';

export function Personalization() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="text-indigo-500" /> AI Personalization Engine
          </h2>
          <p className="text-muted-foreground mt-2">Deliver individualized experiences across all customer touchpoints.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-start gap-4">
            <Sparkles className="w-10 h-10 text-emerald-500 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Predictive Content</h3>
              <p className="text-sm text-muted-foreground mt-1">Showcase the exact articles, products, and messages your customers are most likely to interact with next.</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-start gap-4">
            <Filter className="w-10 h-10 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Micro-Segmentation</h3>
              <p className="text-sm text-muted-foreground mt-1">Automatically cluster users based on behavioral vectors in real-time.</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-start gap-4 md:col-span-2">
            <Users className="w-10 h-10 text-rose-500 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Omnichannel Continuity</h3>
              <p className="text-sm text-muted-foreground mt-1">Maintain identical state and preference awareness whether the customer is on Email, SMS, WhatsApp, or Web.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
