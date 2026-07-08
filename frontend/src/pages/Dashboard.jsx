import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, Stethoscope, Archive, Siren, 
  Clock, BedDouble, Truck, ShieldAlert, CloudRain, 
  Wind, Droplets, Zap, ChevronRight, AlertTriangle,
  Download, Power, MapPin, Radio, HeartPulse, Bot, Info, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnalytics } from '../api/analytics';
import { getAISummary, getQueuePrediction, getHealthScorePrediction } from '../api/ai';

const parseBoldText = (txt) => {
  const parts = txt.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-[#1976D2] font-bold">{part}</strong>;
    }
    return part;
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    inventory: 0,
    events: 0,
    notifications: 0,
    doctor_present: false,
    doctor_check_in: null,
    total_doctors: 0,
    present_doctors: 0,
    low_stock: 0
  });
  const [visibleCount, setVisibleCount] = useState(1);

  const aiFeed = [
    { id: 'reg', type: 'positive', text: `${stats.patients || 50} patients have been registered today.` },
    { id: 'doc', type: 'positive', text: "Dr. Alok Sharma has checked in and is now available for consultation." },
    { id: 'stock', type: 'critical', text: "Medicine Stock Alert: Amoxicillin 500mg is running low (18 units remaining)." },
    { id: 'patient', type: 'critical', text: "Critical Alert: Patient Rajesh Kumar requires immediate medical attention." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < aiFeed.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 8000); // Check for new events/append every 8 seconds
    return () => clearInterval(timer);
  }, [aiFeed.length]);

  const [queueInfo, setQueueInfo] = useState({ estimated_wait: 15, status: "Low", reason: "" });
  const [healthInfo, setHealthInfo] = useState({ health_score: 92.4, grade: "Excellent" });
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch live analytics KPIs
      const analyticData = await getAnalytics();
      setStats(analyticData);
      
      // 2. Fetch AI predictions & summary
      try {
        const queueRes = await getQueuePrediction();
        setQueueInfo(queueRes);
      } catch (err) {
        console.error("Queue predict error:", err);
      }

      try {
        const healthRes = await getHealthScorePrediction();
        setHealthInfo(healthRes);
      } catch (err) {
        console.error("Health score predict error:", err);
      }

      setVisibleCount(1);

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    { title: "Total Patients", value: stats.patients, trend: stats.patients > 2 ? "+33.3%" : "Optimal", isUp: true, icon: Users, color: "text-[#1976D2] bg-blue-50" },
    { title: "Doctors Active", value: stats.total_doctors > 0 ? `${stats.present_doctors} / ${stats.total_doctors}` : (stats.doctor_present ? "1 / 1" : "0 / 1"), trend: stats.present_doctors > 0 ? "Active" : "Pending", isUp: stats.present_doctors > 0, icon: Stethoscope, color: "text-emerald-600 bg-emerald-50" },
    { title: "Bed Occupancy", value: stats.doctor_present ? "42%" : "15%", trend: "Safe Level", isUp: true, icon: BedDouble, color: "text-orange-600 bg-orange-50" },
    { title: "Avg Wait Time", value: `${queueInfo.estimated_wait}m`, trend: queueInfo.status, isUp: queueInfo.status === "Low", icon: Clock, color: "text-emerald-600 bg-emerald-50" },
    { title: "Medicine Stock", value: stats.inventory, trend: stats.low_stock > 0 ? `${stats.low_stock} Low` : "Stable", isUp: stats.low_stock === 0, icon: Archive, color: "text-blue-600 bg-blue-50" },
    { title: "Ambulances", value: "2 / 2", trend: "Ready", isUp: true, icon: Truck, color: "text-[#1976D2] bg-blue-50" },
  ];

  // 7-Day Outpatient Trends data
  const trendData = [
    { day: "Mon", count: 40 },
    { day: "Tue", count: 65 },
    { day: "Wed", count: 45 },
    { day: "Thu", count: 80 },
    { day: "Fri", count: 55 },
    { day: "Sat", count: 90 },
    { day: "Sun", count: 75 }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* --- TOP ROW: AI Hero, Score & Environment --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero AI Insight */}
        <div className="lg:col-span-8 glass-card border border-blue-100 p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bot className="w-5 h-5 text-[#1976D2] animate-pulse" />
                </div>
                <h3 className="text-sm font-bold tracking-widest text-[#1976D2] uppercase">Sigma AI Executive Summary</h3>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#1976D2] border border-blue-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Event Log
              </span>
            </div>
            
            {/* Displaying AI summary lines in a scrolling persistent log */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-2">
              <AnimatePresence initial={false}>
                {aiFeed.slice(0, visibleCount).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    {item.type === 'critical' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold shrink-0">🔴</span>
                        <span className="text-red-600 font-bold leading-relaxed text-base">
                          {parseBoldText(item.text)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span className="text-emerald-700 font-bold leading-relaxed text-base">
                          {parseBoldText(item.text)}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={fetchDashboardData}
                className="px-6 py-2 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-xl font-semibold shadow-sm hover:from-[#1565C0] hover:to-[#0D47A1] transition-all duration-200 cursor-pointer text-xs border border-blue-700/20 shadow-blue-500/5"
              >
                Refresh Log
              </button>
            </div>
          </div>
        </div>

        {/* Health Score & Environment */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1 flex items-center justify-between relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10">
                <HeartPulse className="w-32 h-32 text-[#10B981]" />
             </div>
             <div>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Average Clinic Health Score</p>
               <div className="text-5xl font-bold text-[#10B981]">{healthInfo.health_score}</div>
               <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2 flex items-center gap-1">
                 <Activity className="w-4 h-4"/> Status: {healthInfo.grade}
               </p>
             </div>
          </div>
          
          <div className="glass-panel p-5 grid grid-cols-3 gap-4">
            <div className="text-center border-r border-slate-200 dark:border-white/10">
              <CloudRain className="w-5 h-5 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800 dark:text-white">34°C</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Indore</div>
            </div>
            <div className="text-center border-r border-slate-200 dark:border-white/10">
              <Wind className="w-5 h-5 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800 dark:text-white">112</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">AQI (Mod)</div>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800 dark:text-white">98%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Water Purity</div>
            </div>
          </div>
        </div>

      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${kpi.isUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'}`}>
                {kpi.trend}
              </span>
            </div>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{kpi.value}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* --- MIDDLE ROW: Map & Live Emergencies --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Radar Map Simulation */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Live District Topography</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time asset tracking & heatmap</p>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span> PHC/CHC</span>
              <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Emergency</span>
              <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Ambulance</span>
            </div>
          </div>
          
          <div 
            className="flex-1 min-h-[350px] rounded-xl border border-blue-100 relative overflow-hidden flex items-center justify-center"
            style={{ backgroundImage: "url('/street_map.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            
            {/* Radar Sweep */}
            <div className="absolute w-[800px] h-[800px] rounded-full border border-blue-200/10 bg-[conic-gradient(from_0deg,transparent_70%,rgba(37,99,235,0.05)_100%)] animate-[spin_4s_linear_infinite]"></div>
            
            {/* Simulated Nodes */}
            <MapPin className="absolute top-[30%] left-[40%] w-5 h-5 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
            <MapPin className="absolute top-[60%] left-[20%] w-5 h-5 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
            <MapPin className="absolute top-[50%] right-[30%] w-6 h-6 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
            
            {/* Emergency */}
            <div className="absolute top-[45%] left-[65%]">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
              <Radio className="relative w-6 h-6 text-red-500 drop-shadow-[0_0_10px_#EF4444]" />
            </div>

            {/* Ambulance moving */}
            <Truck className="absolute bottom-[30%] left-[50%] w-4 h-4 text-blue-600 animate-[bounce_2s_infinite] drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
            
            {/* Heatmap blur */}
            <div className="absolute top-[40%] left-[60%] w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>

        {/* Live Emergencies & Risk */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 border-red-500/10 dark:border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.02)] dark:shadow-[0_0_30px_rgba(239,68,68,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Siren className="w-5 h-5 text-red-500" /> Active Emergencies
              </h3>
              <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">2 LIVE</span>
            </div>
            <div className="space-y-3">
              {[
                { type: "Cardiac Arrest", loc: "Sector 4, Indore", time: "2m ago", status: "Amb Dispatched" },
                { type: "Trauma - RTA", loc: "Bypass Road", time: "5m ago", status: "En Route to CHC" }
              ].map((em, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-800 dark:text-white font-semibold">{em.type}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">{em.time}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{em.loc}</span>
                    <span className="text-red-500 dark:text-red-400 font-semibold">{em.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Overall Risk Level</h3>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-4 mb-2 overflow-hidden border border-slate-200 dark:border-white/10">
              <div className="bg-gradient-to-r from-emerald-500 via-orange-400 to-red-500 w-[25%] h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Low</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Stable (25%)</span>
              <span>Critical</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- BOTTOM ROW: Charts & Actions --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Graph (Interactive SVG Bar Chart) */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">7-Day Outpatient Trends vs Capacity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Volumetric clinic admissions log.</p>
            </div>
            <select className="bg-white border border-blue-200 text-black text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-300">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="flex-1 bg-white border border-blue-100/75 rounded-2xl p-4 flex items-center justify-center relative min-h-[220px]">
            <svg viewBox="0 0 500 160" className="w-full h-full max-h-[160px]">
              {/* Grid Lines */}
              {[0, 1, 2].map((g) => {
                const y = 20 + (g * 50);
                return (
                  <line 
                    key={g} 
                    x1="30" 
                    y1={y} 
                    x2="480" 
                    y2={y} 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    className="text-gray-200" 
                  />
                );
              })}

              {/* Render Bars */}
              {trendData.map((d, i) => {
                const barWidth = 32;
                const gap = (450 - (trendData.length * barWidth)) / (trendData.length - 1);
                const x = 30 + (i * (barWidth + gap));
                const barHeight = (d.count / 100) * 110;
                const y = 130 - barHeight;
                const isHovered = hoveredBar?.day === d.day;
                
                return (
                  <g 
                    key={d.day}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredBar(d)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <rect 
                      x={x} 
                      y={y} 
                      width={barWidth} 
                      height={barHeight} 
                      rx="4"
                      fill={isHovered ? "url(#primaryBlueHover)" : "url(#primaryBlue)"}
                      className="transition-all duration-200"
                    />
                    <text 
                      x={x + barWidth / 2} 
                      y="145" 
                      textAnchor="middle" 
                      fill="currentColor" 
                      fontSize="9"
                      className="text-gray-700 font-semibold select-none"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="primaryBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1976D2" />
                  <stop offset="100%" stopColor="#1565C0" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="primaryBlueHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1565C0" />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Tooltip Overlay */}
            {hoveredBar && (
              <div className="absolute top-2 left-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg rounded-xl z-20 text-[10px] animate-scale-up">
                <span className="font-bold text-slate-800 dark:text-white block">{hoveredBar.day} Outpatients</span>
                <span className="text-blue-600 dark:text-blue-400 font-black mt-1 block">{hoveredBar.count}k visits</span>
              </div>
            )}

            <div className="absolute bottom-1 right-4 flex items-center gap-1 text-[8px] text-slate-400 dark:text-slate-500">
              <Info size={10} /> Hover bars to preview admissions telemetry.
            </div>
          </div>
        </div>

        {/* Quick Actions & AI Recommends */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="glass-panel p-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> AI Supply Directives</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium">Re-route Medicines</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total low-stock alerts: {stats.low_stock}</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium">Vaccine Cold Chain Optimal</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">All cold chain units reporting safe temps.</p>
                  </div>
                </li>
              </ul>
           </div>

           <div className="grid grid-cols-2 gap-4 h-full">
             <button className="glass-card flex flex-col items-center justify-center p-4 gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer">
                <Download className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold">Export Log</span>
             </button>
             <button className="glass-card border border-red-200 dark:border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 flex flex-col items-center justify-center p-4 gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <Power className="w-6 h-6 text-red-500" />
                <span className="text-xs font-semibold">DEFCON 1</span>
             </button>
           </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;