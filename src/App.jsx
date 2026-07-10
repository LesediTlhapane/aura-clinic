import React, { useState } from 'react';
import { ClinicProvider } from './context/ClinicContext';
import Sidebar from './components/Sidebar';
import ClinicStatusPanel from './components/ClinicStatusPanel';
import ReceptionWorkspace from './views/ReceptionWorkspace';
import ConsultationWorkspace from './views/ConsultationWorkspace';
import MedicationWorkspace from './views/MedicationWorkspace';
import ClinicInsights from './views/ClinicInsights';
import FutureFeatures from './views/FutureFeatures';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [activeWorkspace, setActiveWorkspace] = useState('reception');

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'reception':
        return <ReceptionWorkspace />;
      case 'consultation':
        return <ConsultationWorkspace />;
      case 'medication':
        return <MedicationWorkspace />;
      case 'insights':
        return <ClinicInsights />;
      case 'future':
        return <FutureFeatures />;
      default:
        return <ReceptionWorkspace />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Platform Navigation Sidebar */}
      <Sidebar activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} />

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen flex flex-col gap-6">
        
        {/* Clinic Status Indicators - Shared Top Bar */}
        <ClinicStatusPanel />

        {/* Dynamic Workspace Container */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkspace}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="h-full"
            >
              {renderWorkspace()}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
}
