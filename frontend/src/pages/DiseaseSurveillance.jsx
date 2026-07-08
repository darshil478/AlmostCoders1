import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Activity, ShieldCheck, TrendingUp, 
  Users, MapPin, Plus, RefreshCw, Heart, Info, BedDouble 
} from 'lucide-react';
import { getSurveillance, reportCase, getMitigationPlans } from '../api/surveillance';

const DiseaseSurveillance = () => {
  const [surveillanceData, setSurveillanceData] = useState([]);
  const [mitigationPlans, setMitigationPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Case Reporting Form states
  const [showForm, setShowForm] = useState(false);
  const [disease, setDisease] = useState("Dengue");
  const [district, setDistrict] = useState("Indore");
  const [submitting, setSubmitting] = useState(false);
  
  // Filter state
  const [filterRisk, setFilterRisk] = useState("All");

  // Hover state for interactive map
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSurveillance();
      setSurveillanceData(data || []);
      
      const mitigation = await getMitigationPlans();
      setMitigationPlans(mitigation?.plans || []);
    } catch (err) {
      console.error("Failed to load surveillance data:", err);
      setError("Failed to connect to surveillance APIs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReportCase = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await reportCase(disease, district);
      alert(`Successfully reported case of ${disease} in ${district}.`);
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to report case.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20';
      case 'moderate': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20';
      default: return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
    }
  };

  const getMapDotColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'moderate': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  // Predefined coordinates for the simulated state map
  const mapNodes = [
    { id: "Indore", x: 120, y: 220, name: "Indore" },
    { id: "Bhopal", x: 220, y: 160, name: "Bhopal" },
    { id: "Ujjain", x: 100, y: 140, name: "Ujjain" },
    { id: "Jabalpur", x: 380, y: 200, name: "Jabalpur" },
    { id: "Gwalior", x: 200, y: 60, name: "Gwalior" }
  ];

  const enrichedMapNodes = mapNodes.map(node => {
    const data = surveillanceData.find(item => item.district.toLowerCase() === node.id.toLowerCase());
    return {
      ...node,
      cases: data ? data.cases : 0,
      risk: data ? data.risk : "Low",
      disease: data ? data.disease : "None",
      lastUpdated: data ? data.lastUpdated : "-"
    };
  });

  const filteredSurveillance = surveillanceData.filter(item => {
    if (filterRisk === "All") return true;
    return item.risk.toLowerCase() === filterRisk.toLowerCase();
  });

  const totalCases = surveillanceData.reduce((acc, curr) => acc + (curr.cases || 0), 0);
  const criticalHotspots = surveillanceData.filter(item => item.risk.toLowerCase() === 'critical').length;

  return (
    <div className="space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">National Disease Surveillance</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Predictive outbreak monitoring, geospatial mapping, and containment logs.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadData}
            className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            <Plus size={18} /> Report Outbreak Case
          </button>
        </div>
      </div>

      {/* Triage / Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 border border-blue-100 dark:border-white/10 relative animate-scale-up">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Report Active Case</h2>
            <form onSubmit={handleReportCase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tracked Disease</label>
                <select 
                  value={disease} 
                  onChange={(e) => setDisease(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Dengue">Dengue Fever</option>
                  <option value="Malaria">Malaria</option>
                  <option value="Influenza">Influenza (Flu)</option>
                  <option value="Covid-19">COVID-19</option>
                  <option value="Chikungunya">Chikungunya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">District / Region</label>
                <select 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Indore">Indore</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Ujjain">Ujjain</option>
                  <option value="Jabalpur">Jabalpur</option>
                  <option value="Gwalior">Gwalior</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? "Submitting..." : "Report Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && surveillanceData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-blue-600">
          <div className="text-center">
            <RefreshCw size={36} className="animate-spin mx-auto mb-4" />
            <p className="font-semibold">Loading Outbreak Matrices...</p>
          </div>
        </div>
      ) : error && surveillanceData.length === 0 ? (
        <div className="glass-panel p-8 text-center text-red-500 border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Database Connection Failed</h3>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={loadData} className="btn-primary mx-auto">Retry Loading</button>
        </div>
      ) : (
        <>
          {/* 2. National Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Surveillance Cases", val: totalCases, icon: Activity, color: "text-blue-600 dark:text-blue-400" },
              { label: "Critical Districts", val: criticalHotspots, icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
              { label: "Vaccinated Target", val: "88M+", icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Active Vectors", val: "Aedes / Anopheles", icon: Info, color: "text-orange-600 dark:text-orange-400" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{stat.label}</span>
                  <stat.icon className={stat.color} size={20} />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stat.val}</h3>
              </div>
            ))}
          </div>

          {/* 3. Map & Hotspot Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Interactive Vector Map Grid */}
            <div className="lg:col-span-8 glass-panel p-6 flex flex-col relative overflow-hidden">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Geospatial Outbreak Heatmap</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Simulated telemetry of clinical outbreak vectors. Hover nodes for live patient counts.</p>
              
              <div className="flex-1 min-h-[380px] bg-slate-100/50 dark:bg-[#03060a]/40 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-center p-4 relative">
                {/* SVG MAP */}
                <svg viewBox="0 0 500 300" className="w-full max-h-[350px] relative z-10">
                  {/* Simulated state outline shape */}
                  <path 
                    d="M 50,50 L 150,30 L 250,40 L 320,20 L 400,60 L 450,110 L 480,180 L 430,250 L 320,270 L 220,250 L 120,280 L 50,220 L 20,150 Z" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="text-blue-100 dark:text-white/5"
                  />
                  <path 
                    d="M 50,50 L 150,30 L 250,40 L 320,20 L 400,60 L 450,110 L 480,180 L 430,250 L 320,270 L 220,250 L 120,280 L 50,220 L 20,150 Z" 
                    fill="currentColor" 
                    className="text-blue-500/[0.02] dark:text-blue-500/[0.01]"
                  />

                  {/* Grid Lines */}
                  <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-white/5" />
                  <line x1="0" y1="200" x2="500" y2="200" stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-white/5" />
                  <line x1="166" y1="0" x2="166" y2="300" stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-white/5" />
                  <line x1="333" y1="0" x2="333" y2="300" stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-white/5" />

                  {/* Connecting Vectors */}
                  <path d="M 120,220 Q 220,160 220,160" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
                  <path d="M 100,140 Q 220,160 220,160" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
                  <path d="M 380,200 Q 220,160 220,160" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
                  <path d="M 200,60 Q 220,160 220,160" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>

                  {/* Interactive Nodes */}
                  {enrichedMapNodes.map((node) => {
                    const dotColor = getMapDotColor(node.risk);
                    const isHovered = hoveredDistrict?.id === node.id;
                    return (
                      <g 
                        key={node.id} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredDistrict(node)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                      >
                        {/* Outer Glow Ping */}
                        {node.cases > 10 && (
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={isHovered ? 20 : 12} 
                            fill={dotColor} 
                            opacity="0.2"
                            className="animate-ping"
                          />
                        )}
                        {/* Hover Ring */}
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={isHovered ? 12 : 8} 
                          fill="none" 
                          stroke={dotColor} 
                          strokeWidth="2" 
                        />
                        {/* Solid Inner Dot */}
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r="5" 
                          fill={dotColor} 
                        />
                        {/* Label */}
                        <text 
                          x={node.x + 10} 
                          y={node.y + 4} 
                          fill="currentColor" 
                          fontSize="10" 
                          fontWeight="bold"
                          className="text-slate-600 dark:text-slate-400 select-none"
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Popover Details Card */}
                {hoveredDistrict ? (
                  <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg z-20 max-w-xs animate-scale-up">
                    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm">
                      <MapPin size={14} className="text-blue-600" /> {hoveredDistrict.name} District
                    </h4>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Primary Outbreak:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{hoveredDistrict.disease}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Active Cases:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{hoveredDistrict.cases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Risk Threshold:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{hoveredDistrict.risk}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                    <Info size={12} /> Hover nodes to preview critical regional loads.
                  </div>
                )}
              </div>
            </div>

            {/* High-Risk Districts Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Filter controls */}
              <div className="glass-panel p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Risk Directives</h2>
                    <select 
                      value={filterRisk} 
                      onChange={(e) => setFilterRisk(e.target.value)}
                      className="bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
                    >
                      <option value="All">All Risks</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1">
                    {filteredSurveillance.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500">No districts match filter</div>
                    ) : (
                      filteredSurveillance.map((d, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border border-slate-200 dark:border-white/5 rounded-xl hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{d.district}</span>
                            <span className="text-[10px] text-slate-400">Outbreak: {d.disease} ({d.cases} cases)</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getRiskColor(d.risk)}`}>
                            {d.risk}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 mt-4">
                  <div className="text-xs text-slate-400 mb-2">Live Alert Containment status:</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-500">
                    <AlertTriangle size={14} className="animate-pulse" /> Emergency Response level 2 active.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4. Active Outbreak Containment Strategies */}
          <div className="glass-panel p-6 border-l-4 border-l-blue-600 dark:border-l-[#06B6D4]">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Active Containment & Mitigation Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {mitigationPlans.map((plan, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{plan.disease} - {plan.district}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/30">
                      {plan.status}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.actions.map((act, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 text-[10px] text-slate-400">
                    Authority: <span className="font-medium text-slate-600 dark:text-slate-300">{plan.authority}</span>
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

export default DiseaseSurveillance;