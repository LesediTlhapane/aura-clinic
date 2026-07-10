import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  Search, Plus, Printer, ArrowRight, ChevronRight, 
  Calendar, ShieldAlert, FileText, CheckCircle2, 
  Move, Settings, User, AlertCircle, FilePlus, HeartHandshake,
  Activity, X, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceptionWorkspace() {
  const {
    departments,
    doctors,
    patients,
    activeQueue,
    logs,
    selectedPatient,
    setSelectedPatient,
    checkInPatient,
    moveFile,
    completeVisit,
    addDepartment,
    getWaitingTime
  } = useClinic();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    patientId: '',
    doctorId: 'dr-peterson',
    priority: 'Medium',
    notes: ''
  });
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    id: '',
    label: '',
    name: '',
    color: 'sky',
    insertAfter: 'doctor'
  });

  const [activeTicketForMove, setActiveTicketForMove] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(null); // ticket data

  // Dynamic search query processing
  const filteredPatients = searchQuery.trim() === '' ? [] : patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.idNumber.includes(searchQuery) ||
    patient.phone.includes(searchQuery) ||
    (patient.medicalAidNumber && patient.medicalAidNumber.includes(searchQuery))
  );

  // Form handlers
  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    if (!checkInForm.patientId) return;
    const ticket = checkInPatient(
      checkInForm.patientId, 
      checkInForm.doctorId, 
      checkInForm.priority, 
      checkInForm.notes
    );
    setShowCheckInModal(false);
    
    // Automatically select the newly checked-in patient to display tracker
    const newQueueItem = activeQueue.find(q => q.patientId === checkInForm.patientId) || 
      { ticketNumber: ticket, patientId: checkInForm.patientId };
    
    const fullPatient = patients.find(p => p.id === checkInForm.patientId);
    setSelectedPatient({ ...fullPatient, queueTicket: ticket });
    setSearchQuery('');
  };

  const handleAddDeptSubmit = (e) => {
    e.preventDefault();
    const idClean = newDeptForm.label.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const success = addDepartment(
      idClean,
      newDeptForm.name,
      newDeptForm.label,
      newDeptForm.color,
      newDeptForm.insertAfter
    );
    if (success) {
      setShowConfigModal(false);
      setNewDeptForm({
        id: '',
        label: '',
        name: '',
        color: 'sky',
        insertAfter: 'doctor'
      });
    }
  };

  const handlePrintTicketClick = (queueItem) => {
    const pInfo = patients.find(p => p.id === queueItem.patientId);
    setShowTicketModal({
      ticketNumber: queueItem.ticketNumber,
      patientName: queueItem.patientName,
      doctorName: queueItem.doctorName,
      arrivalTime: queueItem.arrivalTime,
      fileNumber: pInfo ? pInfo.fileNumber : 'N/A'
    });
  };

  const handleQuickCheckInClick = (patient) => {
    setCheckInForm({
      patientId: patient.id,
      doctorId: doctors[0]?.id || '',
      priority: 'Medium',
      notes: ''
    });
    setShowCheckInModal(true);
  };

  // Get active queue items that are not completed
  const activeQueueList = activeQueue.filter(q => q.status !== 'Completed');

  // Find tracking queue item for currently selected patient details
  const getSelectedPatientQueueItem = () => {
    if (!selectedPatient) return null;
    return activeQueue.find(q => q.patientId === selectedPatient.id && q.status !== 'Completed');
  };

  const currentQueueItem = getSelectedPatientQueueItem();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency': return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDeptColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 border-blue-600 text-blue-100';
      case 'indigo': return 'bg-indigo-500 border-indigo-600 text-indigo-100';
      case 'emerald': return 'bg-emerald-500 border-emerald-600 text-emerald-100';
      case 'amber': return 'bg-amber-500 border-amber-600 text-amber-100';
      case 'rose': return 'bg-rose-500 border-rose-600 text-rose-100';
      case 'purple': return 'bg-purple-500 border-purple-600 text-purple-100';
      default: return 'bg-slate-500 border-slate-600 text-slate-100';
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Universal Search Bar */}
        <div className="relative w-full md:w-2/3 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search patient name, file #, ID #, phone, or medical aid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}

          {/* Search Dropdown Results */}
          <AnimatePresence>
            {filteredPatients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-96 overflow-y-auto divide-y divide-slate-100"
              >
                <div className="px-4 py-2 bg-slate-50/50 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                  Registry Search Results ({filteredPatients.length})
                </div>
                {filteredPatients.map(patient => {
                  const isCheckedIn = activeQueue.some(q => q.patientId === patient.id && q.status !== 'Completed');
                  return (
                    <div 
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setSearchQuery('');
                      }}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700 text-sm overflow-hidden">
                          {patient.avatar ? (
                            <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {patient.name}
                          </h4>
                          <div className="flex flex-wrap gap-x-2.5 text-xs text-slate-400 mt-0.5">
                            <span>File: <strong className="text-slate-600">{patient.fileNumber}</strong></span>
                            <span>•</span>
                            <span>ID: {patient.idNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCheckedIn ? (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                            Active in Queue
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickCheckInClick(patient);
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-xl transition-all"
                          >
                            <FilePlus size={12} />
                            Check-In
                          </button>
                        )}
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setCheckInForm({ patientId: '', doctorId: doctors[0]?.id || '', priority: 'Medium', notes: '' });
              setShowCheckInModal(true);
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus size={16} />
            Check-In Patient
          </button>
          
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
            title="Configure Departments (Workflow Engine)"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Configure Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Operations Board (Queue) */}
        <div className="lg:col-span-2 flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 m-0">Real-Time Operations Board</h2>
              <p className="text-xs text-slate-400 mt-0.5">Active patients currently in clinical workflow</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
              {activeQueueList.length} Checked In
            </span>
          </div>

          <div className="overflow-x-auto">
            {activeQueueList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Activity size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No active patients in queue</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Search a patient above to check them in, or click "Check-In Patient" to start the workflow.
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Assigned Doctor</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Waiting Time</th>
                    <th className="py-3 px-4">File Holder / Location</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {activeQueueList.map((queueItem) => {
                    const waitMin = getWaitingTime(queueItem.checkInTime);
                    const currentDept = departments.find(d => d.id === queueItem.currentDepartmentId);
                    
                    return (
                      <tr 
                        key={queueItem.ticketNumber}
                        className={`hover:bg-slate-50/40 cursor-pointer transition-colors ${
                          selectedPatient?.id === queueItem.patientId ? 'bg-indigo-50/20' : ''
                        }`}
                        onClick={() => {
                          const patient = patients.find(p => p.id === queueItem.patientId);
                          setSelectedPatient(patient);
                        }}
                      >
                        {/* Ticket */}
                        <td className="py-3.5 px-4 font-semibold text-indigo-600">
                          {queueItem.ticketNumber}
                        </td>
                        
                        {/* Patient Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {queueItem.patientName}
                        </td>
                        
                        {/* Assigned Doctor */}
                        <td className="py-3.5 px-4 text-slate-500">
                          {queueItem.doctorName}
                        </td>
                        
                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(queueItem.priority)}`}>
                            {queueItem.priority}
                          </span>
                        </td>
                        
                        {/* Waiting Time */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <span className={waitMin > 30 ? 'text-rose-600' : 'text-slate-600'}>
                              {waitMin} mins
                            </span>
                            {waitMin > 30 && (
                              <ShieldAlert size={14} className="text-rose-500" title="Long wait warning!" />
                            )}
                          </div>
                        </td>

                        {/* File Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              queueItem.currentDepartmentId === 'reception' ? 'bg-blue-500' :
                              queueItem.currentDepartmentId === 'doctor' ? 'bg-indigo-500' :
                              queueItem.currentDepartmentId === 'pharmacy' ? 'bg-emerald-500' : 'bg-slate-500'
                            }`} />
                            <span className="text-xs text-slate-500">
                              {currentDept ? currentDept.name : 'Unknown Location'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Move File Quick Trigger */}
                            <div className="relative">
                              <button
                                onClick={() => setActiveTicketForMove(
                                  activeTicketForMove === queueItem.ticketNumber ? null : queueItem.ticketNumber
                                )}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                                title="Move Physical File"
                              >
                                <Move size={14} />
                              </button>
                              
                              <AnimatePresence>
                                {activeTicketForMove === queueItem.ticketNumber && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                    className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden text-left"
                                  >
                                    <div className="px-3 py-1.5 bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                      Route File To:
                                    </div>
                                    <div className="p-1 max-h-48 overflow-y-auto space-y-0.5">
                                      {departments
                                        .filter(d => d.id !== queueItem.currentDepartmentId)
                                        .map(dept => (
                                          <button
                                            key={dept.id}
                                            onClick={() => {
                                              moveFile(queueItem.ticketNumber, dept.id);
                                              setActiveTicketForMove(null);
                                            }}
                                            className="w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2"
                                          >
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                              dept.id === 'reception' ? 'bg-blue-500' :
                                              dept.id === 'doctor' ? 'bg-indigo-500' :
                                              dept.id === 'pharmacy' ? 'bg-emerald-500' : 'bg-slate-500'
                                            }`} />
                                            {dept.label}
                                          </button>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Print Queue Ticket */}
                            <button
                              onClick={() => handlePrintTicketClick(queueItem)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                              title="Print Queue Ticket"
                            >
                              <Printer size={14} />
                            </button>

                            {/* Finalize visit (Records) */}
                            {queueItem.currentDepartmentId === 'records' && (
                              <button
                                onClick={() => completeVisit(queueItem.ticketNumber)}
                                className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition-all"
                                title="File Closed & Visit Completed"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Selected Patient File & Tracking Info */}
        <div className="flex flex-col gap-6">
          {selectedPatient ? (
            <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 relative overflow-hidden">
              <button
                onClick={() => setSelectedPatient(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4 mb-5 border-b border-slate-100 pb-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                  {selectedPatient.avatar ? (
                    <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">
                    {selectedPatient.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-slate-400">File: {selectedPatient.fileNumber}</span>
                    {currentQueueItem && (
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full">
                        {currentQueueItem.ticketNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Core Summary Details */}
              <div className="space-y-3.5 mb-6 text-xs border-b border-slate-100 pb-4">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2.5">
                  <div>
                    <span className="text-slate-400 block font-medium">SA ID Number</span>
                    <span className="text-slate-700 font-semibold">{selectedPatient.idNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone Number</span>
                    <span className="text-slate-700 font-semibold">{selectedPatient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Medical Aid</span>
                    <span className="text-slate-700 font-semibold truncate block" title={selectedPatient.medicalAidName}>
                      {selectedPatient.medicalAidName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Medical Aid #</span>
                    <span className="text-slate-700 font-semibold">{selectedPatient.medicalAidNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Last Visit</span>
                    <span className="text-slate-700 font-semibold">{selectedPatient.lastVisit || 'First Time'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Next Appointment</span>
                    <span className="text-slate-700 font-semibold truncate block">{selectedPatient.nextAppointment || 'None'}</span>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 flex items-start gap-2 text-rose-800">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5 text-rose-500" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-700">Allergies</span>
                    <span className="font-semibold text-xs text-rose-900">{selectedPatient.allergies}</span>
                  </div>
                </div>
              </div>

              {/* Physical File Tracker: Custom Workflow tracker */}
              {currentQueueItem ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3.5">
                    Physical File Location Tracker
                  </h4>
                  
                  {/* Modern Tracker Bar */}
                  <div className="flex items-center justify-between relative px-2 mb-5">
                    {/* Background Progress Bar */}
                    <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-slate-100 z-0" />
                    
                    {departments.map((dept, index) => {
                      const isActive = currentQueueItem.currentDepartmentId === dept.id;
                      const hasPassed = departments.findIndex(d => d.id === currentQueueItem.currentDepartmentId) >= index;

                      return (
                        <div key={dept.id} className="flex flex-col items-center relative z-10 shrink-0">
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                              isActive 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-110' 
                                : hasPassed 
                                  ? 'bg-white border-indigo-500 text-indigo-500' 
                                  : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            {isActive ? (
                              <motion.div
                                layoutId="tracking-dot"
                                className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                              />
                            ) : (
                              <span className="text-[10px] font-bold">{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 ${
                            isActive ? 'text-indigo-600 font-semibold' : 'text-slate-400'
                          }`}>
                            {dept.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions to move file */}
                  <div className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                      <select
                        value={currentQueueItem.currentDepartmentId}
                        onChange={(e) => moveFile(currentQueueItem.ticketNumber, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="" disabled>Move Physical File To...</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} ({dept.label})
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                    {currentQueueItem.currentDepartmentId === 'records' && (
                      <button
                        onClick={() => completeVisit(currentQueueItem.ticketNumber)}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        Archive File
                      </button>
                    )}
                  </div>

                  {/* Timeline History */}
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5">
                    File Movement Timeline
                  </h4>
                  <div className="space-y-4 border-l border-slate-100 pl-4 py-1 text-xs max-h-48 overflow-y-auto">
                    {currentQueueItem.fileHistory.map((log, index) => (
                      <div key={index} className="relative">
                        {/* Circle marker */}
                        <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border bg-white ${
                          index === currentQueueItem.fileHistory.length - 1 ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-300'
                        }`} />
                        <div>
                          <div className="flex items-center justify-between text-slate-400 mb-0.5">
                            <span className="font-semibold text-slate-700">{log.action}</span>
                            <span>{log.timeMoved}</span>
                          </div>
                          <span className="text-slate-400">Holder: <strong className="text-slate-600">{log.holder}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <AlertCircle size={20} className="text-slate-400 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-700">Patient not checked in</h4>
                  <p className="text-[11px] text-slate-400 mt-1 mb-3">
                    Check the patient in to activate file tracking and start queuing.
                  </p>
                  <button
                    onClick={() => handleQuickCheckInClick(selectedPatient)}
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-xl text-xs font-semibold transition-all"
                  >
                    Quick Check-In
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 text-center text-slate-400 py-16">
              <FileText size={32} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Patient Selected</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Select an active patient from the operations board, or use the search bar to locate a patient and view their tracking status.
              </p>
            </div>
          )}
          
          {/* Real-time system event logs */}
          <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 overflow-hidden">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3.5 border-b border-slate-100 pb-2">
              Platform Activity Logger
            </h4>
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <span className="text-xs text-slate-400 block py-4 text-center italic">No system events logged yet</span>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="text-[11px] flex gap-2 items-start leading-normal">
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded shrink-0">
                      {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <p className={`font-semibold ${
                      log.type === 'success' ? 'text-emerald-700' :
                      log.type === 'warning' ? 'text-rose-700' : 'text-slate-600'
                    }`}>
                      {log.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: CHECK-IN */}
      <AnimatePresence>
        {showCheckInModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setShowCheckInModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">
                New Patient Check-In
              </h3>

              <form onSubmit={handleCheckInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Select Patient
                  </label>
                  <select
                    value={checkInForm.patientId}
                    onChange={(e) => setCheckInForm(prev => ({ ...prev, patientId: e.target.value }))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="" disabled>Choose Patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.fileNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Assign Doctor
                    </label>
                    <select
                      value={checkInForm.doctorId}
                      onChange={(e) => setCheckInForm(prev => ({ ...prev, doctorId: e.target.value }))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} {d.available ? '' : '(Unavailable)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Triage Priority
                    </label>
                    <select
                      value={checkInForm.priority}
                      onChange={(e) => setCheckInForm(prev => ({ ...prev, priority: e.target.value }))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Low">Low (Routine)</option>
                      <option value="Medium">Medium (General)</option>
                      <option value="High">High (Urgent)</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Chief Complaint / Notes
                  </label>
                  <textarea
                    value={checkInForm.notes}
                    onChange={(e) => setCheckInForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g. Flu symptoms, routine checkup, pain..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckInModal(false)}
                    className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/10"
                  >
                    Confirm Check-In
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CONFIG DEPARTMENTS */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-slate-800 mb-2 font-display">
                Configure Workflow Departments
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Add clinical checkpoints dynamically. Physical files can immediately route to these.
              </p>

              <div className="mb-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-2.5">
                <span className="font-bold text-slate-500 uppercase tracking-widest block">Active Sequence</span>
                <div className="flex flex-wrap items-center gap-1 bg-white p-2 border border-slate-200/50 rounded-lg">
                  {departments.map((dept, i) => (
                    <React.Fragment key={dept.id}>
                      <span className="font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {dept.label}
                      </span>
                      {i < departments.length - 1 && <ArrowRight size={12} className="text-slate-300" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddDeptSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Department label (Short Name, e.g. "Laboratory")
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab"
                    value={newDeptForm.label}
                    onChange={(e) => setNewDeptForm(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Department Full Name (Holder Name, e.g. "Clinical Lab")
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pathology Lab Counter"
                    value={newDeptForm.name}
                    onChange={(e) => setNewDeptForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Visual Color Badge
                    </label>
                    <select
                      value={newDeptForm.color}
                      onChange={(e) => setNewDeptForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="blue">Blue</option>
                      <option value="indigo">Indigo</option>
                      <option value="emerald">Emerald</option>
                      <option value="rose">Rose</option>
                      <option value="purple">Purple</option>
                      <option value="amber">Amber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Position Sequence
                    </label>
                    <select
                      value={newDeptForm.insertAfter}
                      onChange={(e) => setNewDeptForm(prev => ({ ...prev, insertAfter: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="" disabled>Insert After...</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          After {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Insert Checkpoint
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: PRINT QUEUE TICKET PREVIEW */}
      <AnimatePresence>
        {showTicketModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-2 border-slate-300 rounded-2xl shadow-2xl max-w-xs w-full p-6 relative flex flex-col items-center"
            >
              <button
                onClick={() => setShowTicketModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>

              {/* Mock Printed Ticket Header */}
              <div className="text-center w-full border-b border-dashed border-slate-300 pb-4 mb-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Aura Clinic™ Receipt</span>
                <h3 className="text-3xl font-extrabold font-display text-indigo-600 mt-1 tracking-tight">
                  {showTicketModal.ticketNumber}
                </h3>
                <span className="text-xs text-slate-400">Physical File Queued</span>
              </div>

              {/* Mock Ticket details */}
              <div className="w-full text-xs space-y-2 border-b border-dashed border-slate-300 pb-4 mb-4 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">PATIENT:</span>
                  <span className="font-bold text-slate-700">{showTicketModal.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FILE NO:</span>
                  <span className="font-bold text-slate-700">{showTicketModal.fileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ASSIGNED:</span>
                  <span className="font-bold text-slate-700">{showTicketModal.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QUEUED AT:</span>
                  <span className="font-bold text-slate-700">{showTicketModal.arrivalTime}</span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="flex flex-col items-center gap-1 text-[9px] font-mono text-slate-400">
                <div className="flex gap-0.5 h-10 w-44 items-end bg-slate-900 px-3 py-1 text-white border border-slate-800 rounded">
                  {/* barcode stripes */}
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[3px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[2px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[4px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[2px] h-full bg-white"/>
                  <div className="w-[2px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[3px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[2px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[4px] h-full bg-white"/>
                  <div className="w-[1px] h-full bg-white"/>
                  <div className="w-[2px] h-full bg-white"/>
                </div>
                <span>* {showTicketModal.ticketNumber} *</span>
              </div>

              <button
                onClick={() => {
                  // Trigger mock print alert
                  alert(`Printing ticket ${showTicketModal.ticketNumber} on thermal printer...`);
                  setShowTicketModal(null);
                }}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-semibold py-2.5 rounded-xl text-xs mt-5 transition-all text-center"
              >
                Trigger Device Print
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
