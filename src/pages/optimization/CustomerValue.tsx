import { Zap, Heart, HandCoins } from 'lucide-react';

export function CustomerValue() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-indigo-500" /> Customer Value AI
          </h2>
          <p className="text-muted-foreground mt-2">Predictive LTV tracking and VIP cohort segmentation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-center items-center h-48 text-center">
            <HandCoins className="w-10 h-10 text-emerald-500 mb-3" />
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Avg Lifetime Value</div>
            <div className="text-3xl font-black mt-1">$1,450.00</div>
            <div className="text-xs text-emerald-500 mt-2 font-medium">+12% vs last quarter</div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-center items-center h-48 text-center">
            <Heart className="w-10 h-10 text-rose-500 mb-3" />
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Retention Probability</div>
            <div className="text-3xl font-black mt-1">94.2%</div>
            <div className="text-xs text-muted-foreground mt-2 font-medium">Based on top 2 cohorts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
