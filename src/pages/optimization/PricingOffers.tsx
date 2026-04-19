import { CreditCard, ArrowUpRight, Percent, Zap } from 'lucide-react';

export function PricingOffers() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="text-indigo-500" /> Pricing & Offers Optimization
          </h2>
          <p className="text-muted-foreground mt-2">AI-driven dynamic pricing models and personalized offer generation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <Percent className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg">Dynamic Discounts</h3>
            <p className="text-sm text-muted-foreground mt-2">Automatically adjust discount rates based on user engagement and conversion probability.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <Zap className="w-8 h-8 text-rose-500 mb-4" />
            <h3 className="font-bold text-lg">Flash Sales Engine</h3>
            <p className="text-sm text-muted-foreground mt-2">Trigger high-conversion scarcity events across segmented audiences.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <ArrowUpRight className="w-8 h-8 text-indigo-500 mb-4" />
            <h3 className="font-bold text-lg">A/B Price Testing</h3>
            <p className="text-sm text-muted-foreground mt-2">Continuously test and refine pricing tiers for maximum ARPU.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
