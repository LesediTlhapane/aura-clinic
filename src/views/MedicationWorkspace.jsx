import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  Pill, CheckSquare, Square, CheckCircle2, 
  Clock, Heart, Activity, FileText, ChevronRight,
  TrendingUp, AlertCircle, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MedicationWorkspace() {
  const {
    activeQueue,
    completePharmacyDispense,
    getWaitingTime
  } = useClinic();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [checkedMeds, setCheckedMeds] = useState({});

  // Patients whose physical file is at the pharmacy
  const pharmacyQueue = activeQueue.filter(q => 
    q.currentDepartmentId === 'pharmacy' && 
    q.status !== 'Completed'
  );

  const activePharmacyItem = activeQueue.find(q => q.ticketNumber === selectedTicket);

  const handleSelectPatient = (ticketNumber) => {
    setSelectedTicket(ticketNumber);
    // Reset checked medications
    setCheckedMeds({});
  };

  const toggleMedCheck = (medName) => {
    setCheckedMeds(prev => ({
      ...prev,
      [medName]: !prev[medName]
    }));
  };

  const handleDispenseSubmit = (ticketNumber) => {
    completePharmacyDispense(ticketNumber);
    setSelectedTicket(null);
    setCheckedMeds({});
  };

  // Stats calculations
  const totalMedsPending = pharmacyQueue.length;
  const waitingMins = pharmacyQueue.map(q => getWaitingTime(q.checkInTime));
  const avgPharmacyWait = waitingMins.length > 0 
    ? Math.round(waitingMins.reduce((a, b) => a + b, 0) / waitingMins.length) 
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Pharmacy Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Pill size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">Medication Workspace</h2>
            <p className="text-xs text-slate-400 mt-0.5">Dispense prescriptions and route files to Archiving</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Awaiting Pharmacy</span>
            <span className="text-sm font-extrabold text-slate-800">{totalMedsPending} Patients</span>
          </div>
          <div className="border-l border-slate-200 pl-4 text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Avg Pharmacy Wait</span>
            <span className="text-sm font-extrabold text-slate-800">{avgPharmacyWait} mins</span>
          </div>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Incoming prescriptions */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag size={14} />
              Prescription Queue ({pharmacyQueue.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {pharmacyQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400 py-16">
                <CheckCircle2 size={32} className="mx-auto text-slate-300 mb-2.5" />
                <h3 className="text-xs font-bold text-slate-700">All Prescriptions Dispensed</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Waiting for doctors to complete consultations and route physical files here.
                </p>
              </div>
            ) : (
              pharmacyQueue.map(item => {
                const isSelected = selectedTicket === item.ticketNumber;
                const medsCount = item.prescription ? item.prescription.medications.length : 0;
                
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
                      <div className="flex flex-wrap gap-x-2.5 text-xs text-slate-400 mt-1">
                        <span>Meds: <strong className="text-slate-600">{medsCount} items</strong></span>
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
        </div>

        {/* Right column: Selected Prescription Dispensation Panel */}
        <div className="lg:col-span-2">
          {activePharmacyItem ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col gap-5">
              
              {/* Header block */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                    {activePharmacyItem.ticketNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1.5">{activePharmacyItem.patientName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Physical File Location: <strong className="text-slate-600">Pharmacy Counter</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Assigned Doctor</span>
                  <span className="text-sm font-semibold text-slate-700">{activePharmacyItem.doctorName}</span>
                </div>
              </div>

              {/* Diagnosis block */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Doctor's Diagnosis:</span>
                <p className="text-slate-700 font-semibold">
                  {activePharmacyItem.prescription?.diagnosis || 'No diagnostic notes recorded.'}
                </p>
              </div>

              {/* Medication Dispensing List */}
              {activePharmacyItem.prescription ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 flex justify-between items-center">
                    <span>Medication Checklist</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">Check items off as you prepare them</span>
                  </h4>

                  <div className="space-y-2">
                    {activePharmacyItem.prescription.medications.map((med, idx) => {
                      const isChecked = !!checkedMeds[med];
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleMedCheck(med)}
                          className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-emerald-50/20 border-emerald-200 text-slate-800' 
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <div className={`mt-0.5 shrink-0 ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {isChecked ? (
                              <CheckSquare size={16} className="fill-emerald-50" />
                            ) : (
                              <Square size={16} />
                            )}
                          </div>
                          <div>
                            <span className={`text-sm font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {med}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-800">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                  <div className="text-xs">
                    <span className="font-bold block uppercase tracking-wider text-amber-700">No Electronic Prescription Attached</span>
                    <span className="font-semibold text-amber-900">
                      This physical file was routed here manually without prescription inputs. Please check the patient's physical folder paper notes before issuing meds.
                    </span>
                  </div>
                </div>
              )}

              {/* Actions panel */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <AlertCircle size={14} className="text-indigo-500 animate-pulse" />
                  <span>Dispensing will automatically route physical file to Archiving</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Close File
                  </button>
                  
                  <button
                    disabled={activePharmacyItem.prescription && activePharmacyItem.prescription.medications.some(m => !checkedMeds[m])}
                    onClick={() => handleDispenseSubmit(activePharmacyItem.ticketNumber)}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 size={12} />
                    Dispense & Dispatch File
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-16 text-center text-slate-400">
              <Pill size={36} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Active Prescription Loaded</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Select a patient from the queue on the left to review the prescription details, prepare checklist packaging, and route the physical folder to records.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
