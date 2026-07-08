import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, QrCode, UserCircle, Activity, Heart, Droplet, 
  Thermometer, ShieldAlert, BrainCircuit, Pill, CalendarClock, 
  History, MapPin, PhoneCall, FileCheck, X
} from 'lucide-react';
import { getPatients, addPatient } from '../api/patients';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Registration modal states
  const [showModal, setShowModal] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerSymptoms, setRegisterSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch patients from API
  const loadPatients = async (selectLatest = false, selectId = null) => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
      if (data.length > 0) {
        if (selectId) {
          const found = data.find(p => p.id === selectId);
          setSelectedPatient(found || data[0]);
        } else if (selectLatest) {
          setSelectedPatient(data[data.length - 1]);
        } else if (!selectedPatient) {
          setSelectedPatient(data[0]);
        } else {
          // Keep current selected if it still exists
          const current = data.find(p => p.id === selectedPatient.id);
          setSelectedPatient(current || data[0]);
        }
      }
    } catch (err) {
      console.error("Error loading patients:", err);
      setError("Failed to connect to the backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!registerName || !registerSymptoms) {
      alert("Please fill in both Name and Symptoms.");
      return;
    }
    try {
      setSubmitting(true);
      const result = await addPatient({
        name: registerName,
        symptoms: registerSymptoms
      });
      alert(`Success: ${result.message}`);
      setRegisterName("");
      setRegisterSymptoms("");
      setShowModal(false);
      // Reload and select the newly registered patient
      if (result.patient) {
        loadPatients(false, result.patient.id);
      } else {
        loadPatients(true);
      }
    } catch (err) {
      console.error("Failed to register patient:", err);
      alert("Error: Failed to register patient.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.symptoms && p.symptoms.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in-up text-[#111827]">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-wide">Patient <span className="text-[#1976D2]">Intelligence</span></h1>
          <p className="text-sm text-[#374151] mt-1 font-medium">Sigma Unified Health Records & Predictive Analysis</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> Register Patient
        </button>
      </div>

      {loading && patients.length === 0 ? (
        <div className="h-full flex-1 flex items-center justify-center text-[#1976D2]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1976D2] mx-auto mb-4"></div>
            <p className="font-semibold text-sm">Syncing Clinical Directory...</p>
          </div>
        </div>
      ) : error && patients.length === 0 ? (
        <div className="glass-panel p-8 text-center text-red-600 border-red-200">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-bold mb-2">Connectivity Error</h3>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => loadPatients()} 
            className="btn-primary mx-auto"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full flex-1 min-h-[500px]">
          
          {/* LEFT PANE: Smart Directory */}
          <div className="xl:col-span-4 flex flex-col gap-4 max-h-[750px]">
            <div className="glass-panel p-2">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1976D2]" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="AI Smart Search (Name, ID, Symptoms)..." 
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-[#111827] placeholder-gray-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="glass-panel flex-1 overflow-y-auto p-2 space-y-2 max-h-[650px]">
              {filteredPatients.length === 0 ? (
                <div className="text-gray-400 text-center py-8 text-sm">No patients found</div>
              ) : (
                filteredPatients.map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedPatient(p)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedPatient && selectedPatient.id === p.id 
                        ? 'bg-[#EEF6FF] border border-blue-200 shadow-sm text-black font-semibold' 
                        : 'bg-white border border-blue-50/50 hover:bg-[#F8FBFF] text-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#111827] text-base truncate">{p.name}</h3>
                      <span className="text-xs text-[#1976D2] bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50 font-semibold">{p.id}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#374151]">
                      <span className="flex items-center gap-1 font-semibold"><Activity className="w-3 h-3 text-emerald-500"/> Score: {p.healthScore}</span>
                      <span className="font-medium">{p.age} Yrs • {p.gender}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANE: Patient Dossier */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {selectedPatient ? (
              <>
                {/* ID Card & Demographics */}
                <div className="glass-panel p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <UserCircle className="w-8 h-8 text-[#1976D2]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#111827] mb-1">{selectedPatient.name}</h2>
                        <div className="flex flex-wrap gap-3 text-xs font-semibold">
                          <span className="text-[#1565C0] border border-blue-200 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1"><QrCode className="w-3 h-3 text-[#1976D2]"/> Digital Health ID</span>
                          <span className="text-[#374151] bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">{selectedPatient.age} Yrs</span>
                          <span className="text-[#374151] bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">Blood: {selectedPatient.blood}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-semibold text-[#374151]">
                      <div className="flex items-center gap-2"><PhoneCall className="w-3 h-3 text-[#1976D2]"/> {selectedPatient.phone}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#1976D2]"/> {selectedPatient.address}</div>
                      <div className="flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-red-500"/> {selectedPatient.emergency}</div>
                      <div className="flex items-center gap-2"><FileCheck className="w-3 h-3 text-emerald-500"/> {selectedPatient.insurance}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vitals & Health Score */}
                  <div className="glass-panel p-6">
                    <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-4">Current Vitals</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#F8FBFF] rounded-xl p-3 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1"><Heart className="w-4 h-4 text-red-500"/> <span className="text-xs text-[#374151]">Heart Rate</span></div>
                        <div className="text-lg font-bold text-[#111827]">{selectedPatient.vitals?.hr || 80} <span className="text-xs font-normal text-[#374151]">bpm</span></div>
                      </div>
                      <div className="bg-[#F8FBFF] rounded-xl p-3 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1"><Activity className="w-4 h-4 text-[#1976D2]"/> <span className="text-xs text-[#374151]">Blood Press.</span></div>
                        <div className="text-lg font-bold text-[#111827]">{selectedPatient.vitals?.bp || "120/80"}</div>
                      </div>
                      <div className="bg-[#F8FBFF] rounded-xl p-3 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1"><Thermometer className="w-4 h-4 text-orange-500"/> <span className="text-xs text-[#374151]">Temp</span></div>
                        <div className="text-lg font-bold text-[#111827]">{selectedPatient.vitals?.temp || "98.6°F"}</div>
                      </div>
                      <div className="bg-[#F8FBFF] rounded-xl p-3 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1"><Droplet className="w-4 h-4 text-[#1976D2]"/> <span className="text-xs text-[#374151]">SpO2</span></div>
                        <div className="text-lg font-bold text-[#111827]">{selectedPatient.vitals?.o2 || "98%"}</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#374151]">Sigma Health Score</span>
                      <span className={`text-2xl font-bold ${selectedPatient.healthScore > 80 ? 'text-[#10B981]' : 'text-orange-500'}`}>{selectedPatient.healthScore}/100</span>
                    </div>
                  </div>

                  {/* AI Predictions & Meds */}
                  <div className="glass-panel p-6 border-blue-100">
                    <h3 className="text-sm font-bold text-[#1976D2] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4"/> AI Predictive Engine
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-[#374151] font-semibold">Risk Assessment</span>
                          <span className={`text-xs font-bold ${selectedPatient.risk === 'Low' ? 'text-emerald-600' : 'text-orange-500'}`}>{selectedPatient.risk}</span>
                        </div>
                        <p className="text-sm text-[#111827] font-semibold bg-[#F2F8FF] p-3 rounded-lg border border-blue-100/60 leading-relaxed">{selectedPatient.prediction}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-[#374151] font-semibold mb-2 block">AI Suggested Protocol</span>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm text-[#111827] font-semibold"><Pill className="w-4 h-4 text-emerald-500"/> {selectedPatient.medications ? selectedPatient.medications.join(', ') : "None"}</li>
                          <li className="flex items-center gap-2 text-sm text-[#111827] font-semibold"><CalendarClock className="w-4 h-4 text-[#1976D2]"/> {selectedPatient.followUp}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Timeline */}
                <div className="glass-panel p-6 flex-1">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-6 flex items-center gap-2">
                    <History className="w-4 h-4 text-[#1976D2]"/> Clinical Timeline
                  </h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#1976D2] before:to-transparent">
                    {selectedPatient.timeline && selectedPatient.timeline.map((event, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-[#1976D2] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-card p-4 rounded-xl border border-blue-100/60 shadow-sm bg-white">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#1976D2] text-xs">{event.date}</span>
                          </div>
                          <p className="text-sm text-[#374151] font-semibold">{event.event}</p>
                        </div>
                      </div>
                    ))}

                    {/* Next Visit / Scheduled Follow-Up */}
                    {selectedPatient.followUp && (
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-emerald-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 animate-pulse"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-card p-4 rounded-xl border border-emerald-200 shadow-sm bg-[#F8FBFF]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                              <CalendarClock className="w-3.5 h-3.5 text-emerald-500" /> Next Scheduled Visit
                            </span>
                          </div>
                          <p className="text-sm text-[#111827] font-bold">{selectedPatient.followUp}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                Select a patient to view details
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register Patient Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 border border-blue-100 relative animate-scale-up bg-white">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#1976D2]" /> Patient Check-In
            </h2>
            
            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">Patient Full Name</label>
                <input 
                  type="text" 
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="e.g., Ramesh Kumar"
                  className="w-full bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-gray-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">Clinical Symptoms</label>
                <textarea 
                  value={registerSymptoms}
                  onChange={(e) => setRegisterSymptoms(e.target.value)}
                  placeholder="e.g., High fever since 2 days, chest congestion, shivering"
                  rows={4}
                  className="w-full bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-gray-400 transition-all resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full mt-4 btn-primary"
              >
                {submitting ? "Processing AI Diagnostics..." : "Complete Check-In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;