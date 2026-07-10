import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Clipboard, Pill, AreaChart, Sparkles, Activity } from 'lucide-react';

export default function Sidebar({ activeWorkspace, setActiveWorkspace }) {
  const workspaces = [
    { id: 'reception', label: 'Reception Workspace', icon: LayoutGrid, desc: 'Patient Check-In & Tracking' },
    { id: 'consultation', label: 'Consultation Workspace', icon: Clipboard, desc: 'Doctor Clinical Records' },
    { id: 'medication', label: 'Medication Workspace', icon: Pill, desc: 'Pharmacy Dispensing' },
    { id: 'insights', label: 'Clinic Insights', icon: AreaChart, desc: 'Operations & Performance' },
    { id: 'future', label: 'Future Integrations', icon: Sparkles, desc: 'AI & Automation Pipeline' }
  ];

  return (
    <aside className="w-80 h-screen bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight text-white m-0 leading-none">
              Aura Clinic<span className="text-indigo-400">™</span>
            </h1>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Operations Platform
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 italic mt-2">
          Smart Clinic Operations Platform
        </p>
      </div>

      {/* Navigation Workspaces */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
          Workspaces
        </div>
        {workspaces.map((ws) => {
          const Icon = ws.icon;
          const isActive = activeWorkspace === ws.id;
          
          return (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              className={`w-full flex items-start gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative text-left group border ${
                isActive 
                  ? 'text-white border-slate-700 bg-slate-800/60' 
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`p-1.5 rounded-lg border transition-all ${
                isActive 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                  : 'bg-slate-800/40 border-slate-700/30 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-600'
              }`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold tracking-wide truncate">{ws.label}</div>
                <div className="text-[10px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                  {ws.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="p-6 border-t border-slate-800 bg-slate-950/40">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500">Developed by</span>
          <span className="text-xs font-semibold text-slate-300 tracking-wide font-display">
            Aura Tech Intelligence
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-400">Local Environment Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
