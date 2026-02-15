import React from 'react';
import { ViewState, NavItem } from '../types';
import { LayoutDashboard, Waypoints, Box, MessageSquare, TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: ViewState.DASHBOARD, label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: ViewState.RAILS, label: 'The Three Rails', icon: <Waypoints size={20} /> },
  { id: ViewState.CAPABILITY, label: 'Capability Explorer', icon: <Box size={20} /> },
  { id: ViewState.FUTURE, label: 'Future Metrics', icon: <TrendingUp size={20} /> },
  { id: ViewState.CHAT, label: 'Analyst Chat', icon: <MessageSquare size={20} /> },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Agentic Economy
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Explorer OS</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeView === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
            <div className="text-xs text-slate-600">
                Data Source: <br/> "Agent-Native Companies"
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};