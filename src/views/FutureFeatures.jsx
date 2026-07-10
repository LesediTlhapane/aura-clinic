import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, MessageSquare, PhoneCall, FileSpreadsheet, 
  Calendar, Check, ShieldCheck, Mail, Send
} from 'lucide-react';

export default function FutureFeatures() {
  const cards = [
    {
      title: 'WhatsApp Operations Integration',
      icon: MessageSquare,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Automatically text patients when doctors are ready or files move between clinics.',
      demo: (
        <div className="bg-slate-900 rounded-2xl p-4 font-sans text-xs border border-slate-800 shadow-inner flex flex-col gap-2.5 max-w-[280px] w-full">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-500">
            <span className="font-bold">Aura WhatsApp Bot</span>
            <span className="text-[10px]">13:28</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-2.5 text-slate-100 max-w-[85%] self-start border border-slate-700/50">
            Hi Sipho. Your file has been routed to **Dr. Peterson**. Consultation Room 1.
          </div>
          <div className="bg-indigo-600 rounded-xl p-2.5 text-white max-w-[85%] self-end">
            Thank you, I am heading there now!
          </div>
        </div>
      )
    },
    {
      title: 'Voice AI receptionist',
      icon: PhoneCall,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'An AI assistant answering phone lines, handling check-ins, and answering questions.',
      demo: (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-900 rounded-2xl shadow-inner max-w-[280px] w-full relative overflow-hidden">
          <div className="flex gap-1.5 items-center justify-center mb-3">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [12, 32, 12] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="w-1 bg-indigo-500 rounded-full"
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Voice Assistant listening...</span>
        </div>
      )
    },
    {
      title: 'Digital Patient Records OCR',
      icon: FileSpreadsheet,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      description: 'Scanning legacy physical patient folders using smart OCR to instantly index records.',
      demo: (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left max-w-[280px] w-full text-xs font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-500">
            <span>Scanning Folder: AURA-2041</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          </div>
          <div className="space-y-1 text-slate-400 text-[10px]">
            <div>[OCR] Extracting ID: <span className="text-emerald-400">8911045231084</span></div>
            <div>[OCR] Name: <span className="text-emerald-400">Sipho Ndlovu</span></div>
            <div>[OCR] Allergies: <span className="text-emerald-400">Penicillin</span></div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-3">
              <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity }} className="h-full bg-indigo-500" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'SMS Alerts & Auto Booking Sync',
      icon: Calendar,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      description: 'Text notifications to notify elderly patients of clinic schedules and details.',
      demo: (
        <div className="bg-slate-900 rounded-2xl p-4 font-sans text-xs border border-slate-800 shadow-inner max-w-[280px] w-full space-y-2">
          <div className="text-slate-400 font-bold text-[10px]">SMS Gateway Notification</div>
          <div className="bg-indigo-600/90 text-white rounded-xl p-3 text-[11px] leading-relaxed shadow-lg">
            Aura Clinic: Your appointment is confirmed for **July 10 at 14:00**. Ticket: **AC-101**.
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header banner */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">Future Integration Pipelines</h2>
            <p className="text-xs text-slate-400 mt-0.5">Designed slots for subsequent modules without affecting the core workflow</p>
          </div>
        </div>
        
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
          <ShieldCheck size={12} className="text-indigo-600" />
          HIPAA & POPIA Ready Architectures
        </span>
      </div>

      {/* Grid of future feature promos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between gap-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
            >
              <div className="flex flex-col gap-2 text-left">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.color} mb-1.5`}>
                  <Icon size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 font-display tracking-tight group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  {card.description}
                </p>
              </div>

              {/* Demo mockup wrapper */}
              <div className="flex items-center justify-center bg-slate-50 border border-slate-200/40 rounded-2xl py-6 px-4">
                {card.demo}
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3 text-slate-400 font-semibold uppercase tracking-wider">
                <span>Phase 2 Rollout</span>
                <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1 transition-colors">
                  Enquire API Info
                  <ChevronRight size={14} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Professional Call To Action Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-100 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        {/* Decorative backdrop gradients */}
        <div className="absolute -left-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-base font-bold font-display text-white tracking-tight">Need a Bespoke Integration?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Our systems engineering team can construct custom interfaces to link physical file drawers with medical diagnostics, radiology feeds, and SA health networks.
        </p>

        <button 
          onClick={() => alert("Forwarding request to Aura Tech Intelligence systems developers...")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10"
        >
          <Send size={12} />
          Contact Aura Tech Intelligence
        </button>
      </div>
    </div>
  );
}
