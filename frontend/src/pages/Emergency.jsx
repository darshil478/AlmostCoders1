import React from 'react';
import { Siren, Activity, Ambulance, BedDouble, AlertTriangle, Users } from 'lucide-react';

const Emergency = () => {
  return (
    <div className="space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-200">
      {/* 1. Header & System Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Siren className="text-red-500" /> Emergency Operations Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time disaster response and critical triage management.</p>
        </div>
        <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm shadow-red-500/10 cursor-pointer">
          Activate Mass Casualty Mode
        </button>
      </div>

      {/* 2. Critical Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "ICU Beds Free", val: "12", icon: BedDouble, color: "text-blue-600 dark:text-blue-400", border: "border-l-blue-600" },
          { label: "Ventilators Available", val: "4", icon: Activity, color: "text-cyan-600 dark:text-cyan-400", border: "border-l-cyan-500" },
          { label: "Ambulances Active", val: "8", icon: Ambulance, color: "text-blue-600 dark:text-blue-400", border: "border-l-blue-500" },
          { label: "Trauma Teams", val: "3", icon: Users, color: "text-blue-600 dark:text-blue-400", border: "border-l-blue-600" }
        ].map((res, i) => (
          <div key={i} className={`glass-card p-6 border border-slate-200/60 dark:border-white/5 border-l-4 ${res.border} shadow-sm`}>
            <res.icon className={`${res.color} mb-2`} size={24} />
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{res.val}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">{res.label}</p>
          </div>
        ))}
      </div>

      {/* 3. Emergency Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Emergency Queue */}
        <div className="lg:col-span-2 enterprise-card">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Emergency Queue & Triage</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50/50 border-b border-blue-100/50">
                  <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Patient ID</th>
                  <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Priority</th>
                  <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "E-9901", priority: "Critical", status: "Inbound", pColor: "text-red-600" }, 
                  { id: "E-9902", priority: "High", status: "Triage", pColor: "text-orange-600" }
                ].map((p, i) => (
                  <tr key={i} className={`border-b border-blue-50/50 hover:bg-blue-50/20 ${i % 2 === 1 ? 'bg-blue-50/10' : 'bg-white'}`}>
                    <td className="px-6 py-4 font-bold text-[#111827]">{p.id}</td>
                    <td className={`px-6 py-4 font-bold ${p.pColor}`}>{p.priority}</td>
                    <td className="px-6 py-4 text-[#374151] font-semibold">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Emergency Intelligence */}
        <div className="glass-panel p-6 border-l-4 border-l-red-500">
          <h2 className="text-lg font-bold text-red-500 mb-6">AI Triage Alerts</h2>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">Targeted AI Recommendation:</p>
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
              <p className="text-red-700 dark:text-red-400 font-bold text-xs leading-relaxed">
                Diversion Alert: Move E-9901 to Trauma Unit 2. Route via North Corridor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;