import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  ClipboardList, CheckCircle2, Clock, Activity, 
  Users, Stethoscope, FileText, Send, UserCheck, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultationWorkspace() {
  const {
    doctors,
    activeQueue,
    completeConsultation,
    moveFile,
    getWaitingTime
  } = useClinic();

  // Active doctor state
  const [activeDoctorId, setActiveDoctorId] = useState(doctors[0]?.id || '');
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Consultation form state
  const [diagnosis, setDiagnosis] = useState('');
  const [medsText, setMedsText] = useState('');

  const currentDoctorObj = doctors.find(d => d.id === activeDoctorId);

  // Queue of patients assigned to this doctor
  const doctorQueue = activeQueue.filter(q => 
    q.doctorId === activeDoctorId && 
    q.status !== 'Completed'
  );

  // Patients currently waiting for the consultation (file is at doctor)
  const waitingPatients = doctorQueue.filter(q => q.currentDepartmentId === 'doctor');
  
  // Patients in outer reception queue for this doctor (file still at reception)
  const incomingPatients = doctorQueue.filter(q => q.currentDepartmentId === 'reception');

  // Completed consultation count today
  const completedConsultations = activeQueue.filter(q => 
    q.doctorId === activeDoctorId && 
    (q.currentDepartmentId === 'pharmacy' || q.currentDepartmentId === 'records' || q.status === 'Completed')
  );

  const activeConsultationItem = activeQueue.find(q => q.ticketNumber === selectedTicket);

  const handleSelectPatient = (ticketNumber) => {
    setSelectedTicket(ticketNumber);
    const item = activeQueue.find(q => q.ticketNumber === ticketNumber);
    if (item && item.prescription) {
      setDiagnosis(item.prescription.diagnosis || '');
      setMedsText(item.prescription.medications.join('\n') || '');
    } else {
      setDiagnosis('');
      setMedsText('');
    }
  };

  const handleCompleteConsultation = (e) => {
    e.preventDefault();
    if (!selectedTicket || !diagnosis.trim() || !medsText.trim()) return;

    const medList = medsText.split('\n').filter(line => line.trim() !== '');
    completeConsultation(selectedTicket, diagnosis, medList);
    
    // Clear forms
    setSelectedTicket(null);
    setDiagnosis('');
    setMedsText('');
  };

  // Estimated wait time helper: 15 minutes per waiting patient
  const estWaitingTime = waitingPatients.length * 15;

  return (
    <div className="flex flex-col gap-6">
      {/* Doctor Workspace Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Stethoscope size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">Consultation Workspace</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select active practitioner profile to view patient files</p>
          </div>
        </div>

        {/* Doctor Selection Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Practitioner:</span>
          <select
            value={activeDoctorId}
            onChange={(e) => {
              setActiveDoctorId(e.target.value);
              setSelectedTicket(null);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Practitioner Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Queue</span>
          <span className="text-2xl font-bold font-display text-slate-800 mt-1">{waitingPatients.length}</span>
          <span className="text-[10px] text-slate-400 mt-2">Physical files in room</span>
        </div>
        
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Incoming Patients</span>
          <span className="text-2xl font-bold font-display text-amber-600 mt-1">{incomingPatients.length}</span>
          <span className="text-[10px] text-slate-400 mt-2">Checked in at reception</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Consults</span>
          <span className="text-2xl font-bold font-display text-emerald-600 mt-1">{completedConsultations.length}</span>
          <span className="text-[10px] text-slate-400 mt-2">Processed files today</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Est. Waiting Time</span>
          <span className="text-2xl font-bold font-display text-indigo-600 mt-1">{estWaitingTime} mins</span>
          <span className="text-[10px] text-slate-400 mt-2">Based on current queue</span>
        </div>
      </div>

      {/* Doctor Workflow Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Consultation Waiting List */}
        <div className="lg:col-span-1 flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList size={14} />
              Files Awaiting Consultation ({waitingPatients.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {waitingPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <UserCheck size={28} className="mx-auto text-slate-300 mb-2" />
                <h3 className="text-xs font-bold text-slate-700">No active physical files</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Queue is clear. Waiting for reception to route physical files here.
                </p>
              </div>
            ) : (
              waitingPatients.map(item => {
                const isSelected = selectedTicket === item.ticketNumber;
                return (
                  <div
                    key={item.ticketNumber}
                    onClick={() => handleSelectPatient(item.ticketNumber)}
                    className={`p-3.5 cursor-pointer hover:bg-slate-50 transition-colors text-left flex justify-between items-center ${
                      isSelected ? 'bg-indigo-50/20 border-l-2 border-indigo-600 pl-3' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-indigo-600">{item.ticketNumber}</span>
                        <h4 className="text-sm font-semibold text-slate-800">{item.patientName}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>Arrival: {item.arrivalTime}</span>
                        <span>•</span>
                        <span>Waiting: {getWaitingTime(item.checkInTime)} mins</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                );
              })
            )}
          </div>

          {incomingPatients.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Patients at Reception ({incomingPatients.length})
              </span>
              <div className="space-y-1.5">
                {incomingPatients.map(item => (
                  <div key={item.ticketNumber} className="flex justify-between items-center text-xs bg-white border border-slate-200/50 p-2 rounded-lg">
                    <span className="font-semibold text-slate-700">{item.patientName}</span>
                    <button
                      onClick={() => moveFile(item.ticketNumber, 'doctor')}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded"
                    >
                      Summon File
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active Consultation File Details */}
        <div className="lg:col-span-2">
          {activeConsultationItem ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
              {/* Consultation Title */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                    {activeConsultationItem.ticketNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1.5">{activeConsultationItem.patientName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Physical File is at: <strong className="text-slate-600">{currentDoctorObj?.room}</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Waiting Time</span>
                  <span className="text-sm font-semibold text-slate-700">{getWaitingTime(activeConsultationItem.checkInTime)} mins</span>
                </div>
              </div>

              {/* Reception Intake Notes */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Reception Intake Notes:</span>
                <p className="text-slate-600 italic font-medium">"{activeConsultationItem.notes}"</p>
              </div>

              {/* Doctor Consultation Inputs */}
              <form onSubmit={handleCompleteConsultation} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Clinical Diagnosis / Symptoms
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe clinical findings, diagnostic observations, or notes..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Electronic Medication Prescription
                    </label>
                    <span className="text-[10px] text-slate-400">Press Enter for new line</span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter medications (one per line):&#10;e.g. Amoxicillin 500mg - 3x Daily&#10;Panado 500mg - As needed"
                    value={medsText}
                    onChange={(e) => setMedsText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                  />
                </div>

                {/* Submission Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <AlertCircle size={14} className="text-amber-500" />
                    <span>Submitting will automatically route file to Pharmacy</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Save Draft
                    </button>
                    
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Send size={12} />
                      Complete & Send File
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-16 text-center text-slate-400">
              <FileText size={36} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Patient File Opened</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Select a patient from the waiting list on the left to review records, document consultation findings, and issue pharmacy routing instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
