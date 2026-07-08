import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Existing Imports
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Doctors = lazy(() => import('./pages/Doctors'));
const AI = lazy(() => import('./pages/AI'));

// NEW IMPORTS: Add these lines
const Analytics = lazy(() => import('./pages/Analytics'));
const DiseaseSurveillance = lazy(() => import('./pages/DiseaseSurveillance'));
const SupplyChain = lazy(() => import('./pages/SupplyChain'));
const Reports = lazy(() => import('./pages/Reports'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-[#3B82F6]">Loading Module...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="ai-intelligence" element={<AI />} />
            
            {/* NEW ROUTES: Add these lines */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="disease-surveillance" element={<DiseaseSurveillance />} />
            <Route path="supply-chain" element={<SupplyChain />} />
            <Route path="reports" element={<Reports />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;