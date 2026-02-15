import React, { useState } from 'react';
import { Network, ShieldCheck, Scale, Globe, Lock, FileCode } from 'lucide-react';

export const RailsVisualizer: React.FC = () => {
  const [activeRail, setActiveRail] = useState<number | null>(null);

  const rails = [
    {
      id: 1,
      title: "Interoperability",
      subtitle: "The Rosetta Stone",
      icon: <Network className="text-blue-400" size={32} />,
      color: "blue",
      description: "Agents need a shared API for behavior. Without protocols for task schemas and tool formats, capability is trapped in silos (walled gardens).",
      details: [
        "Universal Agent Protocol",
        "Task Schemas & Tool Formats",
        "Shared Provenance Signatures"
      ]
    },
    {
      id: 2,
      title: "Accountability",
      subtitle: "Liability Continuity",
      icon: <Scale className="text-amber-400" size={32} />,
      color: "amber",
      description: "You can't sue a dissolved shell. High-stakes domains need a permanent 'Operator of Record' wrapper to hold keys, insurance, and audit logs.",
      details: [
        "Insurance Wrappers",
        "Operator-of-Record Entities",
        "Key Custody & Sign-offs"
      ]
    },
    {
      id: 3,
      title: "Verifiability",
      subtitle: "Evals & Provenance",
      icon: <ShieldCheck className="text-emerald-400" size={32} />,
      color: "emerald",
      description: "Capability must be bought with receipts. We need robust markets for evals, versioned bundles, and—crucially—revocation mechanisms.",
      details: [
        "Certified Capability Bundles",
        "Red-teaming History",
        "Revocation & Recall Paths"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold text-slate-100">The Messy Middle Rails</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The future doesn't arrive as a clean curve. It requires three critical infrastructures to bridge the gap between disposable agents and durable value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rails.map((rail) => (
          <div 
            key={rail.id}
            onClick={() => setActiveRail(activeRail === rail.id ? null : rail.id)}
            className={`
              relative cursor-pointer group rounded-xl border transition-all duration-300 overflow-hidden
              ${activeRail === rail.id 
                ? `bg-${rail.color}-900/10 border-${rail.color}-500 ring-1 ring-${rail.color}-500/50` 
                : 'bg-slate-900 border-slate-800 hover:border-slate-600'}
            `}
          >
            <div className="p-6 space-y-4">
              <div className={`p-3 rounded-lg inline-block bg-${rail.color}-500/10`}>
                {rail.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">{rail.title}</h3>
                <p className={`text-sm text-${rail.color}-400 font-mono mt-1`}>{rail.subtitle}</p>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {rail.description}
              </p>

              <div className={`
                grid grid-rows-[0fr] transition-[grid-template-rows] duration-300
                ${activeRail === rail.id ? 'grid-rows-[1fr] pt-4 border-t border-slate-800' : ''}
              `}>
                <div className="overflow-hidden">
                  <ul className="space-y-2">
                    {rail.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${rail.color}-500`}></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Hover Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${rail.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Globe size={18} className="text-blue-400"/>
                    The Ecosystem Outcome
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    If these rails succeed, we move from <strong>Firm Scarcity</strong> to <strong>Agent Knowledge Markets</strong>. 
                    Capability compounds faster than organizations can hire. 
                    However, without these rails, we end up with "Capability Feudalism"—centralized power masked as open standards.
                </p>
            </div>
            <div className="flex-1 border-l border-slate-800 pl-8">
                 <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Lock size={18} className="text-red-400"/>
                    The Risk
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                   Without <strong>Revocation</strong> (Rail #3), capability markets become malware distribution channels. 
                   Without <strong>Liability Wrappers</strong> (Rail #2), high-stakes automation is legally impossible.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};