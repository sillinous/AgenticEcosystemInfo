import React, { useState } from 'react';
import { Package, AlertTriangle, Shield, CheckCircle, Activity, Code, GitBranch, ArrowDown, PlayCircle, Eye, ChevronRight, XCircle, X, Settings, Database, Clock, Cpu } from 'lucide-react';

export const CapabilityExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interface' | 'behavior' | 'verification' | 'liability'>('interface');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const content = {
    interface: {
      title: "Public Interface",
      code: `{
  "schema": "v1.0.0",
  "task": "financial_audit_l1",
  "inputs": {
    "target_ledger": "ReadStream<CSV>",
    "compliance_rules": "VectorDB<Ref>"
  },
  "permissions": {
    "read": ["s3://finance-data/*"],
    "compute_budget": "5000_tokens"
  },
  "constraints": [
    "NO_EXTERNAL_NET_ACCESS",
    "PII_REDACTION_REQUIRED"
  ]
}`
    },
    behavior: {
      title: "Behavior Graph",
      code: `{
  "workflow": {
    "step_1": "ingest_ledger",
    "step_2": "anomaly_scan(heuristic='z-score')",
    "step_3": "cross_ref_compliance",
    "on_failure": "trigger_human_review"
  },
  "heuristics": "model_v4_finetuned",
  "decision_trace": "enabled(granularity='full')"
}`
    },
    verification: {
      title: "Receipts & Evals",
      code: `{
  "provenance": {
    "author": "did:eth:0x7a...9f",
    "signature": "0x892...12b"
  },
  "evals": {
    "accuracy": 0.985,
    "red_team_score": "A-",
    "tested_on": "dataset_fin_2024_q1"
  },
  "known_failures": [
    "crypto_assets_unsupported",
    "handwritten_receipts"
  ]
}`
    },
    liability: {
      title: "Liability Wrapper",
      code: `{
  "operator_of_record": "AuditCorp_LLC",
  "insurance_policy": "pol_99281_cyber",
  "jurisdiction": "US_DE",
  "revocation_endpoint": "https://api.auditcorp.com/revoke",
  "human_signoff_required": true
}`
    }
  };

  const nodeDetails: Record<string, any> = {
    "ingest": {
        title: "Ingest Ledger Stream",
        type: "process",
        version: "v1.2.4",
        config: {
            "Source": "s3://partner-drop/fin_ledger",
            "Format": "CSV (RFC 4180)",
            "Chunk Size": "15MB",
            "Buffer": "256MB Ring"
        },
        stats: {
            "Avg Latency": "12ms",
            "Throughput": "450 rps"
        }
    },
    "anomaly": {
        title: "Anomaly Scan",
        type: "decision",
        version: "v4.2.0",
        config: {
            "Model": "fin_anomaly_v4.2.quantized",
            "Threshold": "z-score > 2.5",
            "Window": "Rolling 500 txn",
            "Fallback": "Static Ruleset B"
        },
        stats: {
            "Inference": "45ms",
            "False Pos": "0.4%"
        }
    },
    "human_review": {
        title: "Trigger Human Review",
        type: "failure",
        version: "v2.1.0",
        config: {
            "Queue": "L2_Compliance_Ops",
            "SLA": "4 hours",
            "Priority": "High",
            "Snapshot": "Full Stack Trace"
        },
        stats: {
            "Trigger Rate": "1.2%",
            "Avg Resolution": "2.1h"
        }
    },
    "compliance": {
        title: "Compliance Cross-Ref",
        type: "process",
        version: "v3.0.1",
        config: {
            "Database": "Pinecone_Index_77",
            "Top K": "5",
            "Metric": "Cosine Similarity",
            "Policy": "Basel_III_v2024"
        },
        stats: {
            "Lookup": "180ms",
            "Cache Hit": "85%"
        }
    }
  };

  const NODE_WIDTH = "w-72";

  const VerticalLine = () => (
    <div className="flex flex-col items-center h-12 justify-center shrink-0">
      <div className="w-0.5 h-full bg-slate-700"></div>
      <ArrowDown size={14} className="text-slate-700 -mt-1" />
    </div>
  );

  const WorkflowNode = ({ id, step, title, meta, type = 'process', version }: any) => {
    const isSelected = selectedNode === id;
    
    return (
    <div 
        onClick={(e) => { e.stopPropagation(); setSelectedNode(id); }}
        className={`
        relative z-10 ${NODE_WIDTH} p-4 rounded-xl border-2 transition-all duration-300
        flex flex-col gap-2 bg-slate-900 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]
        ${type === 'process' 
            ? (isSelected ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-700 shadow-lg hover:border-blue-500 hover:shadow-blue-900/20') 
            : ''}
        ${type === 'decision' 
            ? (isSelected ? 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'border-violet-500/50 shadow-lg hover:border-violet-400 hover:shadow-violet-900/20')
            : ''}
        `}
    >
        {step && (
            <div className={`
                absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono z-20 shadow-sm transition-colors
                ${isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-950 border-slate-600 text-slate-500'}
            `}>
                {step}
            </div>
        )}
        
        <div className="flex justify-between items-start">
            <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${type === 'decision' ? 'text-violet-400' : 'text-slate-500'}`}>
                {type === 'decision' ? 'Decision Node' : 'Process Step'}
            </span>
            <div className="flex items-center gap-2">
                {version && (
                   <span className={`text-[10px] font-mono px-1.5 rounded border transition-colors ${
                       isSelected 
                       ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' 
                       : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:bg-slate-700'
                   }`}>
                       {version}
                   </span>
                )}
                {type === 'decision' && <Activity size={14} className="text-violet-400" />}
            </div>
        </div>
        
        <div>
            <div className="text-slate-100 font-bold text-sm leading-tight">{title}</div>
            <div className="text-xs text-slate-400 font-mono mt-1">{meta}</div>
        </div>

        {/* Port Indicators */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 ring-2 ring-slate-900"></div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 ring-2 ring-slate-900"></div>

        {/* Failure/Branch Output Port for Decision Nodes */}
        {type === 'decision' && (
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-red-500/50 z-20 group-hover:border-red-400 transition-colors"></div>
        )}
    </div>
  )};

  const FailureBranch = () => {
    const isSelected = selectedNode === 'human_review';
    return (
      <div className="absolute left-1/2 ml-[144px] flex items-center top-1/2 -translate-y-1/2 z-0">
         {/* Dashed Connector Line */}
         <div className="w-16 h-0 border-t-2 border-dashed border-red-500/40 relative flex items-center justify-center">
             <div className="absolute bg-slate-950 px-1.5 py-0.5 rounded border border-red-900/30 -mt-[13px]">
                <span className="text-[9px] text-red-400 font-mono font-bold uppercase tracking-wider">On Fail</span>
             </div>
         </div>
         <ChevronRight size={14} className="text-red-500/40 -ml-2" />

         {/* The Node */}
         <div 
            onClick={(e) => { e.stopPropagation(); setSelectedNode('human_review'); }}
            className={`
                ml-2 w-56 p-3 rounded-lg border backdrop-blur-sm flex items-start gap-3 transition-all duration-200 shadow-lg cursor-pointer group hover:scale-[1.02] active:scale-[0.98]
                ${isSelected 
                    ? 'bg-red-950/30 border-red-400 shadow-[0_0_15px_rgba(248,113,113,0.2)]' 
                    : 'bg-red-950/10 border-red-500/20 hover:bg-red-950/20 shadow-red-900/5'}
            `}
         >
            <div className="mt-1">
                <XCircle size={16} className={`transition-colors ${isSelected ? 'text-red-400' : 'text-red-500/50 group-hover:text-red-400'}`} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="text-xs font-bold text-red-200">Trigger Human Review</div>
                    <span className={`text-[9px] font-mono px-1.5 rounded border ml-2 ${isSelected ? 'bg-red-900/40 border-red-400/30 text-red-200' : 'bg-red-950/40 border-red-500/20 text-red-300'}`}>v2.1.0</span>
                </div>
                <div className="text-[10px] text-red-400/70 font-mono mt-1">Escalation Policy</div>
            </div>
         </div>
      </div>
  )};

  const DetailsSidebar = () => {
      if (!selectedNode || !nodeDetails[selectedNode]) return null;
      const data = nodeDetails[selectedNode];

      return (
          <>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            <div 
                className="absolute top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl p-6 overflow-y-auto z-50"
                style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{data.type}</span>
                        {data.version && (
                             <span className="text-[10px] font-mono bg-slate-800 px-1.5 rounded text-slate-400 border border-slate-700">{data.version}</span>
                        )}
                    </div>
                    <h3 className="font-bold text-lg text-slate-100 leading-tight">{data.title}</h3>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }} className="text-slate-500 hover:text-slate-200 transition-colors p-1 hover:bg-slate-800 rounded-lg">
                      <X size={18} />
                  </button>
              </div>

              <div className="space-y-6">
                  <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3">
                          <Settings size={12} /> Configuration
                      </h4>
                      <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-3 space-y-2">
                          {Object.entries(data.config).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center text-sm border-b border-slate-900/50 last:border-0 pb-1 last:pb-0">
                                  <span className="text-slate-500">{key}</span>
                                  <span className="text-slate-300 font-mono text-xs">{String(value)}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3">
                          <Activity size={12} /> Live Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                           {Object.entries(data.stats).map(([key, value]) => (
                              <div key={key} className="bg-slate-950/50 rounded-lg border border-slate-800 p-3">
                                  <div className="text-[10px] text-slate-500 uppercase mb-1">{key}</div>
                                  <div className="text-lg font-mono text-emerald-400">{String(value)}</div>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  {data.type === 'decision' && (
                       <div className="p-3 bg-violet-900/10 border border-violet-500/20 rounded-lg">
                           <p className="text-xs text-violet-300 leading-relaxed">
                               <strong className="block mb-1 text-violet-200">Decision Logic:</strong>
                               Using a quantized outlier detection model trained on Q1 2024 ledger data. Thresholds dynamically adjust based on daily volume volatility.
                           </p>
                       </div>
                  )}
                  
                   {data.type === 'failure' && (
                       <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                           <p className="text-xs text-red-300 leading-relaxed">
                               <strong className="block mb-1 text-red-200">Incident Protocol:</strong>
                               Blocks transaction batch. Snapshots execution context. Creates high-priority ticket in Ops queue.
                           </p>
                       </div>
                  )}

              </div>
          </div>
          </>
      )
  }

  return (
    <div className="h-full flex flex-col">
       <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Package className="text-violet-400" />
            The Capability Package
        </h2>
        <p className="text-slate-400 mt-2">
            The fundamental asset of the future economy. Don't sell raw experience data; sell certified, versioned capability bundles.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Package Modules</h3>
             <div className="space-y-2">
                <button 
                    onClick={() => setActiveTab('interface')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'interface' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Code size={18} />
                    <span>Interface & Schema</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('behavior'); setViewMode('visual'); setSelectedNode(null); }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'behavior' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Activity size={18} />
                    <span>Behavior Graph</span>
                </button>
                <button 
                    onClick={() => setActiveTab('verification')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'verification' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <CheckCircle size={18} />
                    <span>Verification & Receipts</span>
                </button>
                <button 
                    onClick={() => setActiveTab('liability')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'liability' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Shield size={18} />
                    <span>Liability Wrapper</span>
                </button>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500"/>
                Why this matters
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
                The market won't price "experience" as a vibe. It needs specific inputs, outputs, guarantees, and insurance. This package format is the "SKU" of the agentic economy.
            </p>
          </div>
        </div>

        {/* Right Code/Detail Panel */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
            <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    <div className="ml-4 text-xs font-mono text-slate-500">capability_manifest.json</div>
                </div>

                {activeTab === 'behavior' && (
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button 
                            onClick={() => setViewMode('visual')}
                            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-2 transition-colors ${viewMode === 'visual' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Eye size={12} /> Visual
                        </button>
                         <button 
                            onClick={() => setViewMode('code')}
                            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-2 transition-colors ${viewMode === 'code' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Code size={12} /> Code
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 relative">
                {activeTab === 'behavior' && viewMode === 'visual' ? (
                     <div className={`flex min-h-full transition-all duration-300 ${selectedNode ? 'mr-80' : ''}`}>
                        <div 
                            className="p-10 flex flex-col items-center w-full min-w-min"
                            onClick={() => setSelectedNode(null)}
                        >
                            {/* Start */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-400 mb-0 shrink-0">
                                <PlayCircle size={16} />
                                <span className="text-xs font-mono font-bold">START: ingest_ledger</span>
                            </div>
                            
                            <VerticalLine />
                            
                            {/* Node 1 */}
                            <WorkflowNode 
                                id="ingest"
                                step="1" 
                                title="Ingest Ledger Stream" 
                                meta="15mb/s chunked · CSV"
                                version="v1.2.4"
                            />
                            
                            <VerticalLine />
                            
                            {/* Node 2 + Branch Container */}
                            <div className="relative flex items-center justify-center w-full shrink-0">
                                <WorkflowNode 
                                    id="anomaly"
                                    step="2" 
                                    type="decision"
                                    title="Anomaly Scan" 
                                    meta="model_v4 (z-score)" 
                                    version="v4.2.0"
                                />
                                <FailureBranch />
                            </div>
                            
                            <VerticalLine />
                            
                            {/* Node 3 */}
                            <WorkflowNode 
                                id="compliance"
                                step="3" 
                                title="Compliance Cross-Ref" 
                                meta="VectorDB · 200ms latency" 
                                version="v3.0.1"
                            />

                            <VerticalLine />

                            {/* End */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 shrink-0">
                                <CheckCircle size={16} />
                                <span className="text-xs font-mono font-bold">COMPLETE: commit_log</span>
                            </div>
                        </div>
                        
                        {/* Interactive Sidebar */}
                        <DetailsSidebar />
                     </div>
                ) : (
                    <div className="p-6 font-mono text-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500">// {content[activeTab].title}</span>
                        </div>
                        <pre className="text-slate-300">
                            <code dangerouslySetInnerHTML={{
                                __html: content[activeTab].code
                                    .replace(/"(.*?)":/g, '<span class="text-blue-400">"$1"</span>:')
                                    .replace(/: "(.*?)"/g, ': <span class="text-emerald-400">"$1"</span>')
                                    .replace(/: (\d+)/g, ': <span class="text-orange-400">$1</span>')
                                    .replace(/: (true|false)/g, ': <span class="text-violet-400">$1</span>')
                            }} />
                        </pre>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};