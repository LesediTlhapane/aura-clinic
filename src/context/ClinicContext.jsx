import React, { createContext, useContext, useState, useEffect } from 'react';

const ClinicContext = createContext();

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

// Initial Configurable Departments (Extensible Workflow Engine)
const INITIAL_DEPARTMENTS = [
  { id: 'reception', name: 'Reception Desk', label: 'Reception', color: 'blue', next: 'doctor' },
  { id: 'doctor', name: 'Consultation Room', label: 'Doctor', color: 'indigo', next: 'pharmacy' },
  { id: 'pharmacy', name: 'Pharmacy counter', label: 'Pharmacy', color: 'emerald', next: 'records' },
  { id: 'records', name: 'Records & Archiving', label: 'Records', color: 'slate', next: null },
];

// Initial Doctor Directory
const INITIAL_DOCTORS = [
  { id: 'dr-peterson', name: 'Dr. Peterson', specialty: 'General Practitioner', room: 'Consultation Room 1', available: true },
  { id: 'dr-naidoo', name: 'Dr. Naidoo', specialty: 'Pediatrician', room: 'Consultation Room 2', available: true },
  { id: 'dr-vander-merwe', name: 'Dr. van der Merwe', specialty: 'General Practitioner', room: 'Consultation Room 3', available: true },
  { id: 'dr-patel', name: 'Dr. Patel', specialty: 'Cardiologist', room: 'Consultation Room 4', available: false },
];

// Initial Seed Patients (South African Mock Patient Registry)
const INITIAL_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Sipho Ndlovu',
    fileNumber: 'AURA-2041',
    idNumber: '8911045231084',
    phone: '+27 82 456 7890',
    medicalAidName: 'Discovery Health',
    medicalAidNumber: '902148209',
    allergies: 'Penicillin',
    gender: 'Male',
    age: 36,
    bloodType: 'O+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    lastVisit: '2026-05-12',
    nextAppointment: '2026-07-10 14:00',
    status: 'Checked In',
    medicalAidScheme: 'Classic Comprehensive'
  },
  {
    id: 'pat-2',
    name: 'Sarah Connor',
    fileNumber: 'AURA-3092',
    idNumber: '7508220042081',
    phone: '+27 71 888 2314',
    medicalAidName: 'Medihelp',
    medicalAidNumber: '482019482',
    allergies: 'None',
    gender: 'Female',
    age: 50,
    bloodType: 'A-',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    lastVisit: '2026-06-18',
    nextAppointment: '2026-07-10 14:30',
    status: 'Idle',
    medicalAidScheme: 'Prime Select'
  },
  {
    id: 'pat-3',
    name: 'Amina Patel',
    fileNumber: 'AURA-1049',
    idNumber: '9304155123087',
    phone: '+27 63 124 5592',
    medicalAidName: 'Bonitas',
    medicalAidNumber: 'BO-8840219',
    allergies: 'Sulfa Drugs',
    gender: 'Female',
    age: 33,
    bloodType: 'B+',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
    lastVisit: '2026-07-02',
    nextAppointment: '2026-07-10 15:15',
    status: 'Idle',
    medicalAidScheme: 'Standard Option'
  },
  {
    id: 'pat-4',
    name: 'Johan Botha',
    fileNumber: 'AURA-5820',
    idNumber: '6402185012089',
    phone: '+27 83 992 4810',
    medicalAidName: 'KeyHealth',
    medicalAidNumber: 'KH-992384',
    allergies: 'Aspirin',
    gender: 'Male',
    age: 62,
    bloodType: 'AB+',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    lastVisit: '2026-04-10',
    nextAppointment: '2026-07-10 13:45',
    status: 'Checked In',
    medicalAidScheme: 'Gold Premium'
  },
  {
    id: 'pat-5',
    name: 'Zanele Mthembu',
    fileNumber: 'AURA-0912',
    idNumber: '9612010192083',
    phone: '+27 79 332 9918',
    medicalAidName: 'Discovery Health',
    medicalAidNumber: '93849102',
    allergies: 'None',
    gender: 'Female',
    age: 29,
    bloodType: 'O-',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=60',
    lastVisit: '2026-06-29',
    nextAppointment: '2026-07-11 09:00',
    status: 'Idle',
    medicalAidScheme: 'Classic Smart'
  },
  {
    id: 'pat-6',
    name: 'Francois du Toit',
    fileNumber: 'AURA-7731',
    idNumber: '8205035023086',
    phone: '+27 82 899 4432',
    medicalAidName: 'GEMS',
    medicalAidNumber: 'GE-902341',
    allergies: 'Peanuts',
    gender: 'Male',
    age: 44,
    bloodType: 'A+',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    lastVisit: '2026-07-01',
    nextAppointment: '2026-07-10 16:00',
    status: 'Idle',
    medicalAidScheme: 'Onyx Plan'
  }
];

// Initial Live Simulation Queue
const INITIAL_QUEUE = [
  {
    ticketNumber: 'AC-101',
    patientId: 'pat-1',
    patientName: 'Sipho Ndlovu',
    doctorId: 'dr-peterson',
    doctorName: 'Dr. Peterson',
    arrivalTime: '13:00',
    checkInTime: new Date(Date.now() - 28 * 60 * 1000), // 28 minutes ago
    currentDepartmentId: 'doctor', // Currently at Doctor
    status: 'In Consultation',
    priority: 'High',
    fileHistory: [
      { departmentId: 'reception', timeMoved: '13:00', holder: 'Reception Desk', action: 'Checked In' },
      { departmentId: 'doctor', timeMoved: '13:12', holder: 'Dr. Peterson', action: 'Consultation Started' }
    ],
    prescription: null,
    notes: 'Experiencing acute lower back pain.'
  },
  {
    ticketNumber: 'AC-102',
    patientId: 'pat-4',
    patientName: 'Johan Botha',
    doctorId: 'dr-vander-merwe',
    doctorName: 'Dr. van der Merwe',
    arrivalTime: '13:15',
    checkInTime: new Date(Date.now() - 13 * 60 * 1000), // 13 minutes ago
    currentDepartmentId: 'reception', // Still at reception
    status: 'Waiting in Reception',
    priority: 'Medium',
    fileHistory: [
      { departmentId: 'reception', timeMoved: '13:15', holder: 'Reception Desk', action: 'Checked In' }
    ],
    prescription: null,
    notes: 'Routine blood pressure review.'
  }
];

export const ClinicProvider = ({ children }) => {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [activeQueue, setActiveQueue] = useState(INITIAL_QUEUE);
  const [ticketCounter, setTicketCounter] = useState(103);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [logs, setLogs] = useState([]);
  
  // Dynamic tick for waiting times
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Format date helper
  const getFormattedTime = (dateObj) => {
    const d = dateObj || new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Add a log to visual events history
  const addLog = (message, type = 'info') => {
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        timestamp: new Date(),
        message,
        type,
      },
      ...prev.slice(0, 49),
    ]);
  };

  // 1. Patient Check-In
  const checkInPatient = (patientId, doctorId, priority = 'Medium', notes = '') => {
    const patientObj = patients.find(p => p.id === patientId);
    const doctorObj = doctors.find(d => d.id === doctorId);

    if (!patientObj) return null;

    // Check if patient already checked in
    const isAlreadyCheckedIn = activeQueue.some(q => q.patientId === patientId && q.status !== 'Completed');
    if (isAlreadyCheckedIn) {
      addLog(`Patient ${patientObj.name} is already checked in.`, 'warning');
      return null;
    }

    const ticketNumber = `AC-${ticketCounter}`;
    setTicketCounter(prev => prev + 1);

    const nowStr = getFormattedTime();
    const newQueueItem = {
      ticketNumber,
      patientId,
      patientName: patientObj.name,
      doctorId,
      doctorName: doctorObj ? doctorObj.name : 'Unassigned',
      arrivalTime: nowStr,
      checkInTime: new Date(),
      currentDepartmentId: 'reception',
      status: 'Waiting in Reception',
      priority,
      fileHistory: [
        {
          departmentId: 'reception',
          timeMoved: nowStr,
          holder: 'Reception Desk',
          action: 'Checked In & File Created'
        }
      ],
      prescription: null,
      notes: notes || 'General checkup'
    };

    setActiveQueue(prev => [...prev, newQueueItem]);
    
    // Update patient status in registry
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: 'Checked In', lastVisit: new Date().toISOString().split('T')[0] } : p));
    
    addLog(`Checked in ${patientObj.name} (Ticket ${ticketNumber}). File is at Reception.`, 'success');
    return ticketNumber;
  };

  // 2. Move Physical File to another Department
  const moveFile = (ticketNumber, targetDepartmentId, customAction = '') => {
    const queueItem = activeQueue.find(q => q.ticketNumber === ticketNumber);
    const targetDept = departments.find(d => d.id === targetDepartmentId);

    if (!queueItem || !targetDept) return;

    const timeStr = getFormattedTime();
    
    // Determine dynamic holder name based on department
    let holder = targetDept.name;
    let statusText = `Waiting in ${targetDept.label}`;
    
    if (targetDepartmentId === 'doctor') {
      holder = queueItem.doctorName || 'Assigned Doctor';
      statusText = 'Ready for Consultation';
    } else if (targetDepartmentId === 'pharmacy') {
      holder = 'Pharmacy Staff';
      statusText = queueItem.prescription ? 'Prescription Dispensing' : 'Ready for Pharmacy';
    } else if (targetDepartmentId === 'records') {
      holder = 'Records Archive Room';
      statusText = 'Archiving & Filing';
    }

    const newHistoryEntry = {
      departmentId: targetDepartmentId,
      timeMoved: timeStr,
      holder,
      action: customAction || `Moved file to ${targetDept.label}`
    };

    setActiveQueue(prev => prev.map(item => {
      if (item.ticketNumber === ticketNumber) {
        return {
          ...item,
          currentDepartmentId: targetDepartmentId,
          status: statusText,
          fileHistory: [...item.fileHistory, newHistoryEntry]
        };
      }
      return item;
    }));

    addLog(`File for ${queueItem.patientName} (${ticketNumber}) moved to ${targetDept.label}.`, 'info');
  };

  // 3. Complete Consultation (Doctor completes, prescribes & routes file)
  const completeConsultation = (ticketNumber, diagnosis, medications) => {
    const queueItem = activeQueue.find(q => q.ticketNumber === ticketNumber);
    if (!queueItem) return;

    const timeStr = getFormattedTime();
    const nextDept = 'pharmacy'; // Default routes doctor -> pharmacy

    // Update queue state
    setActiveQueue(prev => prev.map(item => {
      if (item.ticketNumber === ticketNumber) {
        return {
          ...item,
          status: 'Ready for Pharmacy',
          prescription: {
            diagnosis,
            medications,
            issuedAt: timeStr
          },
          currentDepartmentId: nextDept,
          fileHistory: [
            ...item.fileHistory,
            {
              departmentId: nextDept,
              timeMoved: timeStr,
              holder: 'Pharmacy counter',
              action: 'Consultation Complete. Prescription Issued.'
            }
          ]
        };
      }
      return item;
    }));

    addLog(`Dr. complete consultation for ${queueItem.patientName}. Prescribed ${medications.length} items. File moved to Pharmacy.`, 'success');
  };

  // 4. Complete Pharmacy Dispensing
  const completePharmacyDispense = (ticketNumber) => {
    const queueItem = activeQueue.find(q => q.ticketNumber === ticketNumber);
    if (!queueItem) return;

    const timeStr = getFormattedTime();
    const nextDept = 'records'; // Default routes pharmacy -> records

    setActiveQueue(prev => prev.map(item => {
      if (item.ticketNumber === ticketNumber) {
        return {
          ...item,
          status: 'Ready for Archiving',
          currentDepartmentId: nextDept,
          fileHistory: [
            ...item.fileHistory,
            {
              departmentId: nextDept,
              timeMoved: timeStr,
              holder: 'Records File Room',
              action: 'Medication Dispensed. File Sent to Archive.'
            }
          ]
        };
      }
      return item;
    }));

    addLog(`Pharmacy completed dispensing for ${queueItem.patientName} (${ticketNumber}). File moved to Records.`, 'success');
  };

  // 5. Complete Visit (File filed, workflow terminates)
  const completeVisit = (ticketNumber) => {
    const queueItem = activeQueue.find(q => q.ticketNumber === ticketNumber);
    if (!queueItem) return;

    setActiveQueue(prev => prev.map(item => {
      if (item.ticketNumber === ticketNumber) {
        return {
          ...item,
          status: 'Completed',
          fileHistory: [
            ...item.fileHistory,
            {
              departmentId: 'records',
              timeMoved: getFormattedTime(),
              holder: 'Archive Room Cabinet',
              action: 'Physical File Filed & Visit Completed'
            }
          ]
        };
      }
      return item;
    }));

    // Reset status in patient list
    setPatients(prev => prev.map(p => p.id === queueItem.patientId ? { ...p, status: 'Idle' } : p));
    addLog(`Visit finalized for ${queueItem.patientName} (${ticketNumber}). File Archived.`, 'info');
  };

  // Configurable Workflow: Create / Add a new custom department (Lab, Radiology, Accounts, etc.)
  const addDepartment = (id, name, label, color, insertAfterId) => {
    if (departments.some(d => d.id === id)) return false;

    setDepartments(prev => {
      const index = prev.findIndex(d => d.id === insertAfterId);
      const newDept = { id, name, label, color, next: null };

      if (index === -1) {
        // Append to end, fixing links
        const last = prev[prev.length - 1];
        const updatedPrev = prev.map((d, i) => i === prev.length - 1 ? { ...d, next: id } : d);
        return [...updatedPrev, newDept];
      } else {
        // Insert in middle
        const updated = prev.map((d, i) => {
          if (d.id === insertAfterId) {
            newDept.next = d.next;
            return { ...d, next: id };
          }
          return d;
        });
        
        const nextList = [...updated];
        nextList.splice(index + 1, 0, newDept);
        return nextList;
      }
    });

    addLog(`Workflow updated. Added new department: ${label}.`, 'info');
    return true;
  };

  // Calculate Waiting Times dynamically (in minutes)
  const getWaitingTime = (checkInTime) => {
    const diff = Math.floor((currentTime - new Date(checkInTime)) / 60000);
    return Math.max(0, diff);
  };

  // Stats Calculator
  const getStats = () => {
    const active = activeQueue.filter(q => q.status !== 'Completed');
    
    // Average wait time calculation
    const completedItems = activeQueue.filter(q => q.status === 'Completed' || q.status === 'Ready for Archiving');
    const waitingItems = activeQueue.filter(q => q.status === 'Waiting in Reception' || q.status === 'Ready for Consultation');
    
    let avgWaitTime = 18; // default seed average
    if (waitingItems.length > 0) {
      const totalWait = waitingItems.reduce((acc, curr) => acc + getWaitingTime(curr.checkInTime), 0);
      avgWaitTime = Math.round(totalWait / waitingItems.length) || 12;
    }

    const filesInTransit = active.filter(q => q.currentDepartmentId !== 'reception' && q.currentDepartmentId !== 'records').length;
    const availableDoctors = doctors.filter(d => d.available).length;
    const pharmacyQueueCount = active.filter(q => q.currentDepartmentId === 'pharmacy').length;

    return {
      receptionStatus: active.filter(q => q.currentDepartmentId === 'reception').length > 5 ? 'High Volume' : 'Optimal',
      waitingPatients: waitingItems.length,
      averageWaitingTime: avgWaitTime,
      filesInTransit,
      doctorsAvailable: availableDoctors,
      pharmacyQueue: pharmacyQueueCount,
      patientsTodayCount: activeQueue.length,
      completedTodayCount: activeQueue.filter(q => q.status === 'Completed').length,
    };
  };

  return (
    <ClinicContext.Provider
      value={{
        departments,
        doctors,
        patients,
        activeQueue,
        logs,
        selectedPatient,
        setSelectedPatient,
        checkInPatient,
        moveFile,
        completeConsultation,
        completePharmacyDispense,
        completeVisit,
        addDepartment,
        getWaitingTime,
        getStats,
        getFormattedTime
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};
