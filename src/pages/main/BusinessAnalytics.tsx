import { PieChart as PieChartIcon, TrendingUp, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 6000, expenses: 2800 },
  { name: 'Apr', revenue: 8780, expenses: 3908 },
  { name: 'May', revenue: 11900, expenses: 4800 },
  { name: 'Jun', revenue: 14500, expenses: 3800 },
  { name: 'Jul', revenue: 24500, expenses: 4300 },
];

const LEADS_DATA = [
  { name: 'Week 1', incoming: 40, converted: 24 },
  { name: 'Week 2', incoming: 60, converted: 38 },
  { name: 'Week 3', incoming: 85, converted: 45 },
  { name: 'Week 4', incoming: 120, converted: 78 },
];

export function BusinessAnalytics() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
            <PieChartIcon className="text-primary w-6 h-6" /> Business Analytics
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">Macro-level views of all operations, filtered by date and cohort.</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span className="text-success text-sm font-semibold flex items-center bg-success/10 px-2 py-1 rounded-full"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5"/> 24.5%</span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Total Revenue (YTD)</p>
            <h3 className="text-3xl font-extrabold tracking-tight mt-1">$72,680</h3>
          </div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-500/10 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-success text-sm font-semibold flex items-center bg-success/10 px-2 py-1 rounded-full"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5"/> 12.3%</span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">New Customers</p>
            <h3 className="text-3xl font-extrabold tracking-tight mt-1">1,240</h3>
          </div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-rose-500/10 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-rose-500 text-sm font-semibold flex items-center bg-rose-500/10 px-2 py-1 rounded-full"><ArrowDownRight className="w-3.5 h-3.5 mr-0.5"/> 2.1%</span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Churn Rate</p>
            <h3 className="text-3xl font-extrabold tracking-tight mt-1">1.8%</h3>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Revenue vs Expenses</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Lead Conversion (30d)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LEADS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="incoming" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
