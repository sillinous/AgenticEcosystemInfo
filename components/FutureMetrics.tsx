import React from 'react';
import { TrendingDown, TrendingUp, Globe, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Now', GDP: 100, GNI: 100 },
  { name: '+2 Years', GDP: 110, GNI: 115 },
  { name: '+5 Years', GDP: 125, GNI: 140 },
  { name: '+10 Years', GDP: 140, GNI: 180 },
];

export const FutureMetrics: React.FC = () => {
  return (
    <div className="space-y-8">
       <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Macro Lens: GDP vs GNI</h2>
        <p className="text-slate-400 mt-2 max-w-2xl">
            Why GDP gets blunter: Production becomes cheap/free at the margin. Ownership of capability (GNI) determines who actually captures the value, regardless of where the "agent" ran.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                 <Globe size={18} className="text-blue-400"/>
                 Divergence of Production & Income
             </h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc'}}
                            cursor={{fill: '#1e293b'}}
                        />
                        <Legend />
                        <Bar dataKey="GDP" fill="#64748b" name="GDP (Production Location)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="GNI" fill="#8b5cf6" name="GNI (Ownership/Income)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                      <TrendingDown size={18} className="text-red-400"/>
                      Headcount Leverage
                  </h4>
                  <p className="text-sm text-slate-400">
                      Capital shifts from funding headcount to funding <strong>leverage</strong>. Investors demand capability with receipts, not narratives about "hiring plans."
                  </p>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                      <Users size={18} className="text-emerald-400"/>
                      The New Architect
                  </h4>
                  <p className="text-sm text-slate-400">
                      Execution becomes cheap, but judgment becomes expensive. The role of the architect shifts from "coordinating humans" to <strong>Governor + Curator + Risk Designer</strong>.
                  </p>
              </div>

               <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                      <TrendingUp size={18} className="text-amber-400"/>
                      Base Wars
                  </h4>
                  <p className="text-sm text-slate-400">
                      The final moat is access to a permissioned user base. Platforms will compete for loyal users not just for ads, but as a substrate for capability deployment.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};