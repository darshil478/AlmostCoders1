import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Video, Calendar, AlertTriangle, 
  Activity, User, Clock, BrainCircuit, 
  TrendingUp, MapPin, Award, PhoneCall,
  Siren, Star, Power, ChevronRight
} from 'lucide-react';
import { getDoctors, checkinDoctor, checkoutDoctor } from '../api/doctor';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live doctors status from backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getDoctors();
      if (data && data.length > 0) {
        setDoctors(data);
      }
    } catch (err) {
      console.error("Failed to fetch live doctors list:", err);
      setError("Failed to connect to the workforce directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleToggleDuty = async (doc) => {
    try {
      if (doc.present) {
        const res = await checkoutDoctor(doc.id);
        alert(res.message);
      } else {
        const res = await checkinDoctor(doc.id);
        alert(res.message);
      }
      fetchDoctors();
    } catch (err) {
      console.error("Failed to toggle doctor duty:", err);
      alert("Error: Failed to change duty status.");
    }
  };

  // Find Featured Doctor (Dr. Sharma) or first doc
  const featuredDoctor = doctors.find(d => d.name.includes("Sharma")) || doctors[0] || { name: "Dr. Sharma", present: false, check_in: null };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-wide">Workforce <span className="text-blue-600 dark:text-cyan-400">Intelligence</span></h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live Rosters, Telemedicine Status & AI Burnout Prediction</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary">
            <Calendar className="w-4 h-4" /> Master Schedule
          </button>
          <button className="btn-primary">
            <BrainCircuit className="w-5 h-5" /> AI Shift Optimization
          </button>
        </div>
      </div>

      {loading && doctors.length === 0 ? (
        <div className="h-full flex-1 flex items-center justify-center text-blue-600 dark:text-[#00F0FF]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-[#00F0FF] mx-auto mb-4"></div>
            <p>Syncing Workforce Roster...</p>
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center text-red-500 border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Connectivity Error</h3>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={fetchDoctors} 
            className="btn-primary mx-auto"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* --- LIVE DUTY BAR (Featured live connection to backend) --- */}
          <div className="glass-panel p-6 border-blue-100 dark:border-blue-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-[#00F0FF]/5 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${featuredDoctor.present ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'}`}>
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-800 dark:text-white font-bold text-lg">{featuredDoctor.name} (Featured Doctor)</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${featuredDoctor.present ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                    {featuredDoctor.present ? 'On Duty' : 'Off Duty'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {featuredDoctor.present ? `Checked in at 09:00 AM` : 'Check-in is pending'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleToggleDuty(featuredDoctor)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all relative z-10 flex items-center gap-2 cursor-pointer ${featuredDoctor.present ? 'bg-red-500/10 border border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-500/20 dark:text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400'}`}
            >
              <Power className="w-4 h-4" />
              {featuredDoctor.present ? 'Check Out Doctor' : 'Check In Doctor'}
            </button>
          </div>

          {/* --- TOP ROW: KPIs --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-5 border border-slate-200/60 dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <User className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Roster Attendance</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-white">
                {doctors.filter(d => d.present).length}<span className="text-sm font-normal text-slate-400 ml-1">/ {doctors.length}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Doctors On Duty</p>
            </div>
            
            <div className="glass-card p-5 border border-slate-200/60 dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Video className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span> Live</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-white">84</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Active Teleconsultations</p>
            </div>

            <div className="glass-card p-5 border border-slate-200/60 dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">+12% vs Normal</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-white">78<span className="text-sm font-normal text-slate-400 ml-1">Pts/Doc</span></h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Avg Patient Load</p>
            </div>

            <div className="glass-card p-5 border border-slate-200/60 dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">Action Req</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-white">12</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Burnout Risk Alerts</p>
            </div>
          </div>

          {/* --- MIDDLE ROW: AI Burnout & Optimization --- */}
          <div className="glass-panel p-6 border-blue-100 dark:border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-[#00F0FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-blue-600 dark:text-[#00F0FF] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5"/> AI Burnout Prediction Engine
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Analysis of active shifts, patient volume, and historical stress data indicates <span className="font-bold text-red-500">Dr. Alok Verma</span> is operating at 92% cognitive load (14-hour continuous emergency shift).
                </p>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#081320] border border-red-500/20 dark:border-red-500/30 p-3 rounded-xl">
                  <Siren className="w-5 h-5 text-red-500 animate-pulse" />
                  <div className="text-sm">
                    <span className="text-slate-800 dark:text-white font-medium">Critical Overload:</span> <span className="text-red-500">Intervention Required</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">AI Recommended Action</h3>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald-500"/></div>
                      <div>
                        <p className="text-sm text-slate-800 dark:text-white font-medium">Deploy Relief Personnel</p>
                        <p className="text-xs text-blue-600 dark:text-[#00F0FF]">Reassign Dr. Maya Patel to District Hospital</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      Execute Reassignment
                    </button>
                    <button className="flex-1 btn-secondary py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                      Modify Parameters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- BOTTOM ROW: Doctor Cards --- */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Active Roster & Telemedicine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {doctors.map((doc) => (
                <div key={doc.id} className={`glass-card p-6 flex flex-col relative overflow-hidden border border-slate-200/60 dark:border-white/5 ${doc.isEmergencyAssigned ? 'border-red-500/30 shadow-[0_4px_12px_rgba(239,68,68,0.04)] dark:shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`}>
                  
                  {/* Emergency Indicator Background */}
                  {doc.isEmergencyAssigned && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  )}

                  {/* Header: Avatar, Name, Rank */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#00F0FF]/20 dark:to-blue-500/20 border border-blue-200 dark:border-[#00F0FF]/30 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-blue-600 dark:text-[#00F0FF]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-800 dark:text-white">{doc.name}</h4>
                          <span className={`w-1.5 h-1.5 rounded-full ${doc.present ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-[#00F0FF] font-medium">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded text-xs font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400"/> {doc.rating}
                    </div>
                  </div>

                  {/* Location & Experience */}
                  <div className="space-y-2 mb-4 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Award className="w-3.5 h-3.5 text-slate-400" /> {doc.experience} Experience
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {doc.schedule}
                    </div>
                  </div>

                  {/* Patient Load & Burnout */}
                  <div className="mb-6 mt-auto relative z-10">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Patient Load</span>
                      <span className={`font-bold ${doc.patientLoad > 85 ? 'text-red-500' : doc.patientLoad > 70 ? 'text-orange-500' : 'text-emerald-500'}`}>{doc.patientLoad}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 mb-3">
                      <div 
                        className={`h-full rounded-full ${doc.patientLoad > 85 ? 'bg-red-500 shadow-[0_0_8px_#EF4444]' : doc.patientLoad > 70 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                        style={{ width: `${doc.patientLoad}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Burnout Risk:</span>
                      <span className={`font-semibold ${doc.burnoutRisk === 'Critical' ? 'text-red-500 animate-pulse' : doc.burnoutRisk === 'Elevated' ? 'text-orange-500' : 'text-emerald-500'}`}>{doc.burnoutRisk}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    <button className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${doc.telemedicine ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500 cursor-not-allowed border-none'}`}>
                      <Video className="w-3.5 h-3.5" /> 
                      {doc.telemedicine ? 'Live Consult' : 'Offline'}
                    </button>
                    <button 
                      onClick={() => handleToggleDuty(doc)}
                      className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${doc.present ? 'bg-red-500/10 border border-red-500/20 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {doc.present ? 'Duty Off' : 'Duty On'}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Doctors;