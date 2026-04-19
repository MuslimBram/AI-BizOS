import { Network, ArrowRightCircle, Target, GitPullRequest } from 'lucide-react';

export function FunnelAI() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative p-10">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="text-indigo-500" /> Funnel Optimization AI
          </h2>
          <p className="text-muted-foreground mt-2">Map, analyze, and optimize conversion routes autonomously.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm col-span-2">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><GitPullRequest className="text-muted-foreground" /> Top Conversion Route</h3>
             
             <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">1</div>
                  <div className="flex-1 border border-border p-3 rounded-lg text-sm bg-muted/20">LinkedIn Organic Post</div>
                  <div className="text-xs font-bold text-emerald-500">100%</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">2</div>
                  <div className="flex-1 border border-border p-3 rounded-lg text-sm bg-muted/20">Landing Page Checkout</div>
                  <div className="text-xs font-bold text-emerald-500">42% (Drop: 58%)</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                  <div className="flex-1 border border-border p-3 rounded-lg text-sm bg-muted/20">Email Sequence Nurture</div>
                  <div className="text-xs font-bold text-emerald-500">18% Conversion</div>
                </div>
             </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Target className="text-muted-foreground" /> AI Suggestions</h3>
             <ul className="space-y-4">
               <li className="text-sm border-l-2 border-rose-500 pl-3">
                 <p className="font-bold text-foreground">High friction detected</p>
                 <p className="text-muted-foreground mt-1 text-xs">Step 2 form length is causing 30% of bounces.</p>
               </li>
               <li className="text-sm border-l-2 border-emerald-500 pl-3">
                 <p className="font-bold text-foreground">Retarget pattern found</p>
                 <p className="text-muted-foreground mt-1 text-xs">Sending an SMS after 4 hours recovers 12%.</p>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
