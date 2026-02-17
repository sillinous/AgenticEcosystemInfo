import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Zap, Briefcase, GitPullRequest, ArrowUpRight, ExternalLink } from 'lucide-react';
import { INSIGHTS } from '../constants';
import { ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const data = [
  { name: 'Y1', cost: 100, capability: 10 },
  { name: 'Y2', cost: 60, capability: 30 },
  { name: 'Y3', cost: 30, capability: 80 },
  { name: 'Y4', cost: 10, capability: 150 },
  { name: 'Y5', cost: 5, capability: 300 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Mapping insights to views for interactivity
  const getViewForInsight = (title: string): ViewState => {
    if (title.includes("API") || title.includes("Wrapper")) return ViewState.CAPABILITY;
    if (title.includes("Rails")) return ViewState.RAILS;
    if (title.includes("Base Wars")) return ViewState.FUTURE;
    return ViewState.DASHBOARD;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INSIGHTS.map((insight, idx) => (
          <div 
            key={idx} 
            onClick={() => onNavigate(getViewForInsight(insight.title))}
            className="group relative bg-slate-900 border border-slate-800 p-5 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95"
          >
            <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{insight.category}</span>
                <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-slate-100 font-bold mb-2 group-hover:text-blue-200 transition-colors">{insight.title}</h3>
            <p className="text-xs text-slate-400 leading-snug">{insight.description}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                Explore Module <ArrowUpRight size={12} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-1">Execution Cost vs. Capability Density</h3>
          <p className="text-xs text-slate-500 mb-6">As execution gets cheap (Cost), valuable assets shift to verified behavior (Capability).</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px'}}
                    itemStyle={{color: '#f8fafc'}}
                />
                <Area type="monotone" dataKey="capability" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCap)" name="Capability Capital" strokeWidth={3} />
                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeDasharray="5 5" name="Execution Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold text-slate-200 mb-4">Core Economy Shifts</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                   <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:bg-red-500/20 transition-colors"><Briefcase size={20}/></div>
                   <div>
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Asset Class</div>
                       <div className="text-sm font-medium text-slate-200">Firm → Capability</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors"><GitPullRequest size={20}/></div>
                   <div>
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Architecture</div>
                       <div className="text-sm font-medium text-slate-200">Monolith → Hybrid Shell</div>
                   </div>
                </div>
                 <div className="flex items-center gap-4 group">
                   <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors"><Zap size={20}/></div>
                   <div>
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Speed</div>
                       <div className="text-sm font-medium text-slate-200">Employment → Deployment</div>
                   </div>
                </div>
              </div>
           </div>
           
           <div className="mt-8 pt-6 border-t border-slate-800 relative overflow-hidden group p-4 bg-slate-950/50 rounded-lg">
               <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Zap size={24} className="text-violet-500" />
               </div>
               <div className="text-[10px] font-mono text-slate-500 mb-2">TERMINAL STATE</div>
               <div className="text-2xl font-bold text-white tracking-tighter">
                   Capability <span className="text-violet-400">Capital</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};