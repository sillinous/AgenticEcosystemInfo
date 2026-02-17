import React, { useState } from 'react';
import { Package, AlertTriangle, Shield, CheckCircle, Activity, Code, GitBranch, ArrowDown, PlayCircle, Eye, ChevronRight, XCircle, X, Settings, Database, Clock, Cpu, History, ExternalLink, Box, GripVertical, FileText, Lock, Award, Zap } from 'lucide-react';

export const CapabilityExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interface' | 'behavior' | 'verification' | 'liability'>('interface');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Drag and Drop State
  const [nodeOrder, setNodeOrder] = useState<string[]>(['ingest', 'anomaly', 'compliance']);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const manifestContent = {
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
  }
}`
    },
    liability: {
      title: "Liability Wrapper",
      code: `{
  "operator_of_record": "AuditCorp_LLC",
  "insurance_policy": "pol_99281_cyber",
  "jurisdiction": "US_DE",
  "human_signoff_required": true
}`
    }
  };

  const nodeDataMap: Record<string, any> = {
    "ingest": {
        id: "ingest",
        title: "Ingest Ledger Stream",
        type: "process",
        meta: "15mb/s chunked · CSV Validation",
        version: "v1.2.4",
        lineage: ["v1.2.3 (Stable)", "v1.2.0 (BETA)"],
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
        id: "anomaly",
        title: "Anomaly Scan",
        type: "decision",
        meta: "L-17 Outlier Model (z-score)",
        version: "v4.2.0",
        lineage: ["v4.1.9 (Outdated)", "v4.0.0 (Legacy)"],
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
        id: "human_review",
        title: "Trigger Human Review",
        type: "failure",
        version: "v2.1.0",
        lineage: ["v2.0.0 (Initial)"],
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
        id: "compliance",
        title: "Compliance Cross-Ref",
        type: "process",
        meta: "Basel-III Vector Index · Audit Log",
        version: "v3.0.1",
        lineage: ["v3.0.0 (Major Upgrade)", "v2.9.4"],
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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    const newOrder = [...nodeOrder];
    const item = newOrder.splice(draggedIndex, 1)[0];
    newOrder.splice(toIndex, 0, item);
    setNodeOrder(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const WorkflowNode = ({ id, step, title, meta, type = 'process', version, isDragging, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd, width = NODE_WIDTH }: any) => {
    const isSelected = selectedNode === id;
    const isProcess = type === 'process';
    const isDecision = type === 'decision';
    const isFailure = type === 'failure';

    const baseClasses = `relative z-10 ${width} rounded-xl border-2 transition-all duration-300 flex flex-col cursor-pointer group hover:scale-[1.02] active:scale-[0.98] overflow-hidden`;
    
    let typeClasses = '';
    if (isProcess) {
        typeClasses = isSelected 
            ? 'bg-slate-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
            : 'bg-slate-900 border-slate-800 shadow-lg hover:border-blue-500/50 hover:shadow-blue-900/10';
    } else if (isDecision) {
        typeClasses = isSelected
            ? 'bg-violet-950/30 border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.2)]'
            : 'bg-violet-950/10 border-violet-500/30 shadow-lg hover:border-violet-400/60 hover:shadow-violet-900/10 hover:bg-violet-950/20';
    } else if (isFailure) {
        typeClasses = isSelected
            ? 'bg-red-950/40 border-red-500 border-dashed shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            : 'bg-red-950/10 border-red-500/30 border-dashed shadow-lg hover:border-red-400/60 hover:shadow-red-900/10 hover:bg-red-950/20';
    }
    
    const dragClasses = isDragging ? 'opacity-30 scale-95 border-dashed border-slate-500' : '';
    const dropTargetClasses = isDragOver ? 'translate-y-2 ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-950' : '';

    return (
    <div 
        draggable={!isFailure}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        onClick={(e) => { e.stopPropagation(); setSelectedNode(id); }}
        className={`${baseClasses} ${typeClasses} ${dragClasses} ${dropTargetClasses}`}
    >
        {step && (
            <div className={`
                absolute -left-3 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-20 shadow-sm transition-colors
                ${isSelected 
                    ? (isFailure ? 'bg-red-600 border-red-400 text-white' : isProcess ? 'bg-blue-600 border-blue-400 text-white' : 'bg-violet-600 border-violet-400 text-white')
                    : 'bg-slate-950 border-slate-700 text-slate-500'}
            `}>
                {step}
            </div>
        )}
        
        <div className={`px-4 py-3 border-b flex justify-between items-center ${
            isProcess ? 'bg-slate-950/30 border-slate-800' : 
            isDecision ? 'bg-violet-500/5 border-violet-500/20' : 
            'bg-red-500/5 border-red-500/20'
        }`}>
            <div className="flex items-center gap-2">
                {!isFailure && <GripVertical size={14} className="text-slate-600 cursor-grab active:cursor-grabbing" />}
                {isProcess && <Cpu size={14} className={isSelected ? "text-blue-400" : "text-slate-500"} />}
                {isDecision && <GitBranch size={14} className="text-violet-400" />}
                {isFailure && <AlertTriangle size={14} className="text-red-400" />}
                
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    isProcess ? 'text-slate-500' : 
                    isDecision ? 'text-violet-400' : 
                    'text-red-400'
                }`}>
                    {isProcess ? 'Process Step' : isDecision ? 'Decision Point' : 'Failure Handler'}
                </span>
            </div>
            
             {version && (
                   <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                       isSelected 
                       ? (isProcess ? 'bg-blue-500 border-blue-300 text-blue-900' : isDecision ? 'bg-violet-500 border-violet-300 text-violet-900' : 'bg-red-500 border-red-300 text-red-900')
                       : 'bg-slate-800 border-slate-700 text-slate-400'
                   }`}>
                       {version}
                   </span>
                )}
        </div>
        
        <div className="p-4">
            <div className={`font-bold text-sm leading-tight mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>{title}</div>
            <div className={`text-[10px] font-mono opacity-60 ${isSelected ? 'text-white' : 'text-slate-400'}`}>{meta}</div>
        </div>

        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-600"></div>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-600"></div>

        {isDecision && (
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-950 border-2 border-red-500/50 z-20 group-hover:border-red-400 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
        )}
    </div>
  )};

  const FailureBranch = () => {
    const node = nodeDataMap['human_review'];
    return (
      <div className="absolute left-1/2 ml-[144px] flex items-center top-1/2 -translate-y-1/2 z-0">
         <div className="w-16 h-0 border-t-2 border-dashed border-red-500/40 relative flex items-center justify-center">
             <div className="absolute bg-slate-950 px-1.5 py-0.5 rounded border border-red-900/30 -mt-[13px]">
                <span className="text-[9px] text-red-400 font-mono font-bold uppercase tracking-wider">On Fail</span>
             </div>
         </div>
         <ChevronRight size={14} className="text-red-500/40 -ml-2" />
         <div className="ml-2">
            <WorkflowNode 
                {...node}
                width="w-64"
                isDragging={false}
                isDragOver={false}
            />
         </div>
      </div>
  )};

  const InterfaceVisual = () => (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><FileText size={24}/></div>
            <div>
                <h3 className="text-xl font-bold text-slate-100">Task Definition Contract</h3>
                <p className="text-sm text-slate-500">financial_audit_l1 / v1.0.0</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Input Schemas</span>
                <div className="space-y-2">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs font-mono text-slate-300">target_ledger: ReadStream&lt;CSV&gt;</div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs font-mono text-slate-300">compliance_rules: VectorDB&lt;Ref&gt;</div>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Runtime Constraints</span>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/5 p-2 rounded border border-red-400/20">
                        <Lock size={12}/> NO_EXTERNAL_NET_ACCESS
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/5 p-2 rounded border border-amber-400/20">
                        <Shield size={12}/> PII_REDACTION_REQUIRED
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-blue-600/5 border border-blue-600/20 p-6 rounded-xl relative overflow-hidden group">
            <Zap size={40} className="absolute -bottom-4 -right-4 text-blue-400/10 group-hover:text-blue-400/20 transition-all"/>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-3">Compute Entitlement</span>
            <div className="text-2xl font-bold text-white tracking-tighter">5,000 <span className="text-blue-400 font-mono text-lg">TOKENS</span></div>
            <div className="mt-2 text-xs text-slate-400">Scoped to s3://finance-data/* (Read-Only)</div>
        </div>
    </div>
  );

  const VerificationVisual = () => (
    <div className="p-8 space-y-8 max-w-2xl mx-auto flex flex-col items-center">
        <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-48 h-48 rounded-full border-4 border-emerald-500/30 flex flex-col items-center justify-center bg-slate-900 shadow-2xl">
                <Award size={64} className="text-emerald-400 mb-2"/>
                <div className="text-3xl font-bold text-white tracking-tighter">98.5%</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Accuracy Eval</div>
            </div>
        </div>
        <div className="w-full space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-200">Cryptographic Provenance</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">VERIFIED</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Author DID</span>
                        <span className="text-slate-300 font-mono">did:eth:0x7a...9f</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Benchmark Data</span>
                        <span className="text-slate-300 font-mono">dataset_fin_2024_q1</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">A-</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Red Team Score</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">3.2k</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Exec History</div>
                </div>
            </div>
        </div>
    </div>
  );

  const LiabilityVisual = () => (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center p-8 bg-amber-500/5 rounded-3xl border border-amber-500/20 mb-8 relative">
            <Shield size={120} className="text-amber-500/20 absolute"/>
            <div className="relative text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Liability Wrapper</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Operator of Record: Active
                </div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <Database size={20} className="text-slate-500"/>
                <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Entity Name</div>
                    <div className="text-sm font-medium text-slate-200">AuditCorp_LLC</div>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-400 transition-all"><ExternalLink size={14}/></button>
            </div>
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <Clock size={20} className="text-slate-500"/>
                <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Sign-off Policy</div>
                    <div className="text-sm font-medium text-slate-200">Human Approval Required (High Stakes)</div>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <Shield size={20} className="text-emerald-500"/>
                <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Insurance Coverage</div>
                    <div className="text-sm font-medium text-slate-200">pol_99281_cyber (DE Jurisdiction)</div>
                </div>
            </div>
        </div>
    </div>
  );

  const DetailsSidebar = () => {
      if (!selectedNode || !nodeDataMap[selectedNode]) return null;
      const data = nodeDataMap[selectedNode];
      return (
          <>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            <div 
                className="absolute top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl p-6 overflow-y-auto z-50 flex flex-col"
                style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold tracking-wider ${
                            data.type === 'decision' ? 'bg-violet-500/20 text-violet-400' : 
                            data.type === 'failure' ? 'bg-red-500/20 text-red-400' : 
                            'bg-blue-500/20 text-blue-400'
                        }`}>
                            {data.type}
                        </span>
                        {data.version && (
                             <span className="text-[10px] font-mono bg-slate-800 px-1.5 rounded text-slate-400 border border-slate-700">{data.version}</span>
                        )}
                    </div>
                    <h3 className="font-bold text-xl text-slate-100 leading-tight">{data.title}</h3>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }} className="text-slate-500 hover:text-slate-200 transition-colors p-1 hover:bg-slate-800 rounded-lg">
                      <X size={18} />
                  </button>
              </div>
              <div className="space-y-6 flex-1">
                  <div>
                      <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"><Settings size={12} /> Live Configuration</h4>
                      <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-3 space-y-2">
                          {Object.entries(data.config).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center text-xs border-b border-slate-900/50 last:border-0 pb-1 last:pb-0">
                                  <span className="text-slate-500 font-medium">{key}</span>
                                  <span className="text-slate-300 font-mono">{String(value)}</span>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div>
                      <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"><Activity size={12} /> Metrics</h4>
                      <div className="grid grid-cols-2 gap-3">
                           {Object.entries(data.stats).map(([key, value]) => (
                              <div key={key} className="bg-slate-950/50 rounded-lg border border-slate-800 p-3">
                                  <div className="text-[9px] text-slate-600 uppercase mb-1 font-bold">{key}</div>
                                  <div className={`text-lg font-mono ${String(key).includes('Fail') || String(key).includes('Trigger') ? 'text-red-400' : 'text-emerald-400'}`}>{String(value)}</div>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div>
                      <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"><History size={12} /> Lineage</h4>
                      <div className="space-y-2">
                          {data.lineage?.map((v: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 text-[11px] text-slate-400 hover:text-slate-300 cursor-pointer group">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
                                  <span className="font-mono">{v}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all">
                      <ExternalLink size={14} /> Audit Trace
                  </button>
              </div>
          </div>
          </>
      )
  }

  return (
    <div className="h-full flex flex-col">
       <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Box className="text-violet-400" />
            Capability Explorer
        </h2>
        <p className="text-slate-400 mt-2">
            Inspect the encapsulated behavior bundles that form the "Retained Capital" of an agent-native organization.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Package Specification</h3>
             <div className="space-y-2">
                {[
                    { id: 'interface', label: 'Interface Schema', icon: <Code size={18}/>, color: 'blue' },
                    { id: 'behavior', label: 'Behavior Graph', icon: <Activity size={18}/>, color: 'violet' },
                    { id: 'verification', label: 'Verification Logic', icon: <CheckCircle size={18}/>, color: 'emerald' },
                    { id: 'liability', label: 'Liability Context', icon: <Shield size={18}/>, color: 'amber' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setViewMode('visual'); setSelectedNode(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === tab.id ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30` : 'text-slate-400 hover:bg-slate-800 hover:translate-x-1'}`}
                    >
                        {tab.icon}
                        <span className="font-bold text-sm">{tab.label}</span>
                    </button>
                ))}
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={48} className="text-yellow-500"/></div>
            <h4 className="text-slate-200 font-bold mb-2 flex items-center gap-2">Operational Note</h4>
            <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                Capability bundles are versioned and auditable. Unlike raw data, these bundles are certified for specific performance envelopes.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
            <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
                    <div className="ml-4 text-[10px] font-mono text-slate-500 uppercase tracking-tighter">capability_manifest_{activeTab}.json</div>
                </div>
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                    <button 
                        onClick={() => setViewMode('visual')}
                        className={`px-3 py-1 rounded text-[10px] font-bold flex items-center gap-2 transition-colors ${viewMode === 'visual' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Eye size={12} /> VISUAL
                    </button>
                    <button 
                        onClick={() => setViewMode('code')}
                        className={`px-3 py-1 rounded text-[10px] font-bold flex items-center gap-2 transition-colors ${viewMode === 'code' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Code size={12} /> SOURCE
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 relative">
                {viewMode === 'visual' ? (
                    <div className={`h-full transition-all duration-300 ${selectedNode ? 'mr-80' : ''}`}>
                        {activeTab === 'behavior' ? (
                            <div className="p-12 flex flex-col items-center w-full min-w-min" onClick={() => setSelectedNode(null)}>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/30 text-blue-400 mb-0 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                    <PlayCircle size={14} />
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Entry: Workflow Start</span>
                                </div>
                                {nodeOrder.map((nodeId, idx) => {
                                    const node = nodeDataMap[nodeId];
                                    return (
                                        <React.Fragment key={nodeId}>
                                            <VerticalLine />
                                            <div className="relative flex items-center justify-center w-full">
                                                <WorkflowNode 
                                                    {...node}
                                                    step={idx + 1}
                                                    isDragging={draggedIndex === idx}
                                                    isDragOver={dragOverIndex === idx}
                                                    onDragStart={(e: React.DragEvent) => handleDragStart(e, idx)}
                                                    onDragOver={(e: React.DragEvent) => handleDragOver(e, idx)}
                                                    onDrop={(e: React.DragEvent) => handleDrop(e, idx)}
                                                    onDragEnd={handleDragEnd}
                                                />
                                                {node.id === 'anomaly' && <FailureBranch />}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                <VerticalLine />
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                                    <CheckCircle size={14} />
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Exit: Verified Commit</span>
                                </div>
                                <div className="mt-8 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-center">
                                        <GripVertical size={12} /> Drag nodes to reorder sequence
                                    </p>
                                </div>
                            </div>
                        ) : activeTab === 'interface' ? <InterfaceVisual /> : 
                            activeTab === 'verification' ? <VerificationVisual /> : 
                            <LiabilityVisual />}
                        <DetailsSidebar />
                    </div>
                ) : (
                    <div className="p-8 font-mono text-xs leading-relaxed">
                        <div className="flex items-center gap-2 mb-6 text-slate-500"><Box size={14} /><span>// Viewing serialized capability module</span></div>
                        <pre className="text-slate-300 overflow-x-auto">
                            <code dangerouslySetInnerHTML={{
                                __html: manifestContent[activeTab].code
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