import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  AreaChart, TrendingUp, Clock, FileText, 
  Users, Stethoscope, Award, Zap
} from 'lucide-react';

export default function ClinicInsights() {
  const { activeQueue, doctors, getStats } = useClinic();
  const stats = getStats();

  // Find most visited doctor based on today's queue
  const doctorStats = doctors.map(doc => {
    const count = activeQueue.filter(q => q.doctorId === doc.id).length;
    return { name: doc.name, count };
  });
  
  const mostVisitedDoc = doctorStats.reduce((max, curr) => 
    curr.count > max.count ? curr : max
  , { name: 'Dr. Peterson', count: 2 });

  // Mock static data for peak hours (08:00 - 17:00)
  const peakHoursData = [
    { hour: '08:00', count: 12 },
    { hour: '09:00', count: 24 },
    { hour: '10:00', count: 32 },
    { hour: '11:00', count: 28 },
    { hour: '12:00', count: 15 },
    { hour: '13:00', count: 20 },
    { hour: '14:00', count: 38 }, // Peak
    { hour: '15:00', count: 25 },
    { hour: '16:00', count: 18 },
    { hour: '17:00', count: 8 },
  ];

  // SVG chart sizing
  const peakChartWidth = 500;
  const peakChartHeight = 160;
  const maxCount = Math.max(...peakHoursData.map(d => d.count));
  const barPadding = 16;
  const barWidth = (peakChartWidth / peakHoursData.length) - barPadding;

  // Mock static data for weekly files processed
  const filesProcessedData = [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 52 },
    { day: 'Wed', count: 48 },
    { day: 'Thu', count: 64 },
    { day: 'Fri', count: 70 },
  ];

  // SVG line chart coordinates helper
  const lineChartWidth = 500;
  const lineChartHeight = 160;
  const maxFileCount = Math.max(...filesProcessedData.map(d => d.count));
  
  const getLineCoordinates = () => {
    const points = filesProcessedData.map((d, index) => {
      const x = (lineChartWidth / (filesProcessedData.length - 1)) * index;
      const y = lineChartHeight - (d.count / maxFileCount) * (lineChartHeight - 20) - 10;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const linePoints = getLineCoordinates();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <AreaChart size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Clinic Insights</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time throughput metrics, receptionist speed, and bottlenecks</p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Visits Today</span>
          <span className="text-3xl font-extrabold font-display text-slate-800 mt-1.5 block">
            {stats.patientsTodayCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <strong className="text-emerald-600 font-semibold">+18%</strong> compared to yesterday
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Avg Queue Time</span>
          <span className="text-3xl font-extrabold font-display text-indigo-600 mt-1.5 block">
            {stats.averageWaitingTime}m
          </span>
          <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            Target: under 20 minutes
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Most Loaded Doctor</span>
          <span className="text-lg font-bold text-slate-800 mt-2.5 block truncate">
            {mostVisitedDoc.name}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Award size={12} className="text-indigo-500" />
            {mostVisitedDoc.count} active consults queued
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Receptionist Speed</span>
          <span className="text-3xl font-extrabold font-display text-emerald-600 mt-1.5 block">
            96%
          </span>
          <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Zap size={12} className="text-emerald-500 animate-pulse" />
            File checkout under 35s
          </span>
        </div>
      </div>

      {/* Main analytical graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours Traffic (SVG Bar Chart) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Peak Hours (Today's Hourly Traffic)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Identifies patient volumes to optimize shifts</p>
          </div>
          
          <div className="w-full flex items-center justify-center py-4 bg-slate-50/50 border border-slate-100 rounded-xl">
            <svg 
              viewBox={`0 0 ${peakChartWidth} ${peakChartHeight + 30}`} 
              className="w-full max-w-[480px]"
            >
              {/* grid lines */}
              <line x1="0" y1="0" x2={peakChartWidth} y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={peakChartHeight/2} x2={peakChartWidth} y2={peakChartHeight/2} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={peakChartHeight} x2={peakChartWidth} y2={peakChartHeight} stroke="#e2e8f0" strokeWidth="1" />

              {/* Bars */}
              {peakHoursData.map((d, i) => {
                const barHeight = (d.count / maxCount) * (peakChartHeight - 20);
                const x = i * (barWidth + barPadding) + barPadding/2;
                const y = peakChartHeight - barHeight;
                const isPeak = d.count === maxCount;

                return (
                  <g key={d.hour}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      className={`transition-all duration-300 hover:opacity-80 cursor-pointer ${
                        isPeak 
                          ? 'fill-indigo-600 shadow-md' 
                          : 'fill-slate-300 hover:fill-indigo-400'
                      }`}
                    />
                    {/* Hover tooltip text showing above peak */}
                    <text
                      x={x + barWidth/2}
                      y={y - 6}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-500 font-mono"
                    >
                      {d.count}
                    </text>
                    {/* X axis labels */}
                    <text
                      x={x + barWidth/2}
                      y={peakChartHeight + 18}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-400"
                    >
                      {d.hour.split(':')[0]}h
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>Peak traffic observed at: <strong className="text-slate-700">14:00 (38 visits)</strong></span>
            <span>Total Capacity: 82%</span>
          </div>
        </div>

        {/* Weekly throughput (SVG Line Chart) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Weekly Physical Files Processed</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking reception archive closure completion rates</p>
          </div>

          <div className="w-full flex items-center justify-center py-4 bg-slate-50/50 border border-slate-100 rounded-xl">
            <svg 
              viewBox={`0 0 ${lineChartWidth} ${lineChartHeight + 30}`}
              className="w-full max-w-[480px]"
            >
              {/* grid lines */}
              <line x1="0" y1="0" x2={lineChartWidth} y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={lineChartHeight/2} x2={lineChartWidth} y2={lineChartHeight/2} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={lineChartHeight} x2={lineChartWidth} y2={lineChartHeight} stroke="#e2e8f0" strokeWidth="1" />

              {/* Area under the line */}
              <path
                d={`M 0,${lineChartHeight} L ${linePoints} L ${lineChartWidth},${lineChartHeight} Z`}
                fill="url(#indigo-gradient)"
                opacity="0.1"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="indigo-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* The Line */}
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                points={linePoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots on points */}
              {filesProcessedData.map((d, index) => {
                const x = (lineChartWidth / (filesProcessedData.length - 1)) * index;
                const y = lineChartHeight - (d.count / maxFileCount) * (lineChartHeight - 20) - 10;
                
                return (
                  <g key={d.day}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5.5"
                      className="fill-indigo-600 stroke-white stroke-2 hover:r-7 transition-all cursor-pointer"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      className="text-[10px] font-extrabold fill-slate-700 font-mono"
                    >
                      {d.count}
                    </text>
                    <text
                      x={x}
                      y={lineChartHeight + 18}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-400"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>Weekly Target: <strong className="text-slate-700">250 files</strong></span>
            <span>Total Achieved: <strong className="text-slate-700">279 files (111%)</strong></span>
          </div>
        </div>

      </div>

      {/* Doctor Performance & Loads Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Consultation Department Load</h3>
          <p className="text-xs text-slate-400 mt-0.5">Analyses patient load across active medical practitioners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.map(doc => {
            const docLoad = activeQueue.filter(q => q.doctorId === doc.id && q.status !== 'Completed').length;
            const completedCount = activeQueue.filter(q => q.doctorId === doc.id && (q.currentDepartmentId === 'pharmacy' || q.status === 'Completed')).length;
            
            return (
              <div 
                key={doc.id} 
                className="border border-slate-200/70 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{doc.name}</h4>
                  <span className="text-[10px] text-indigo-600 font-semibold">{doc.specialty}</span>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Active waiting list:</span>
                    <span className="font-bold text-slate-700">{docLoad} patients</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Completed consultations:</span>
                    <span className="font-bold text-slate-700">{completedCount} patients</span>
                  </div>
                  
                  {/* Load progress bar */}
                  <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full rounded-full ${docLoad > 3 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${Math.min(100, (docLoad / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
