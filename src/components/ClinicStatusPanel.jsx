import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Users, Clock, RefreshCw, UserCheck, Pill, ShieldAlert } from 'lucide-react';

export default function ClinicStatusPanel() {
  const { getStats } = useClinic();
  const stats = getStats();

  const cards = [
    {
      title: 'Reception Status',
      value: stats.receptionStatus,
      icon: Users,
      color: stats.receptionStatus === 'Optimal' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100',
      description: 'Patient throughput rate'
    },
    {
      title: 'Patients Waiting',
      value: stats.waitingPatients,
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description: 'Awaiting doctor consult'
    },
    {
      title: 'Avg Waiting Time',
      value: `${stats.averageWaitingTime} mins`,
      icon: Clock,
      color: stats.averageWaitingTime > 30 ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-600 bg-slate-50 border-slate-100',
      description: 'Calculated in real-time'
    },
    {
      title: 'Files In Transit',
      value: stats.filesInTransit,
      icon: RefreshCw,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      description: 'Physical files in movement'
    },
    {
      title: 'Doctors Available',
      value: `${stats.doctorsAvailable}/4`,
      icon: UserCheck,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      description: 'On-duty consultants'
    },
    {
      title: 'Pharmacy Queue',
      value: stats.pharmacyQueue,
      icon: Pill,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
      description: 'Prescriptions dispensing'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex flex-col p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{card.title}</span>
              <div className={`p-1.5 rounded-lg border ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-display text-slate-800 tracking-tight">{card.value}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">{card.description}</span>
          </div>
        );
      })}
    </div>
  );
}
