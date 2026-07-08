import React, { useState, useEffect } from 'react';
import { 
  Box, ThermometerSnowflake, Truck, AlertTriangle, 
  Activity, QrCode, PackageSearch, TrendingUp, 
  MapPin, CheckCircle2, Factory, BarChart3, Bot, X, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';
import DashboardCard from '../components/DashboardCards';
import Charts from '../components/Charts';
import { getInventory, dispenseMedicine, restockMedicine } from '../api/inventory';
import { getInventoryForecast } from '../api/ai';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("dispense"); // "dispense" | "restock"
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Forecast states
  const [forecasts, setForecasts] = useState([]);
  const [runningForecast, setRunningForecast] = useState(false);
  const [hoveredTemp, setHoveredTemp] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Load Inventory
  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to fetch medicine inventory from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAction = async (e) => {
    e.preventDefault();
    if (!selectedItem || quantity <= 0) return;
    
    try {
      setSubmitting(true);
      let result;
      if (modalType === "dispense") {
        result = await dispenseMedicine(selectedItem.id, quantity);
        alert(result.message);
      } else {
        result = await restockMedicine(selectedItem.id, quantity);
        alert(result.message);
      }
      setShowModal(false);
      loadInventory(); // reload
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Error: Transaction failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunForecast = async () => {
    try {
      setRunningForecast(true);
      const data = await getInventoryForecast();
      setForecasts(data);
      alert("AI Demand Forecast Completed!");
    } catch (err) {
      console.error("Forecast failed:", err);
      alert("Error: AI Forecast failed.");
    } finally {
      setRunningForecast(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-wide">Supply Chain <span className="text-blue-600 dark:text-cyan-400">Matrix</span></h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-Optimized Logistics & Cold Chain Monitoring</p>
        </div>
        <button 
          onClick={handleRunForecast}
          disabled={runningForecast}
          className="btn-secondary"
        >
          <Bot className="w-4 h-4" /> {runningForecast ? "Running AI Models..." : "Run AI Demand Forecast"}
        </button>
      </div>

      {loading && inventory.length === 0 ? (
        <div className="h-full flex-1 flex items-center justify-center text-blue-600 dark:text-[#00F0FF]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-[#00F0FF] mx-auto mb-4"></div>
            <p>Syncing Supply Chain Ledger...</p>
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center text-red-500 border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Connectivity Error</h3>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={loadInventory} 
            className="btn-primary mx-auto"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enhanced Medicine Consumption Trend Card */}
              <div className="glass-panel p-6 flex flex-col justify-between bg-white border border-blue-100 shadow-sm rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Medicine Consumption Trend</h3>
                    <p className="text-xs text-[#374151] font-semibold">Weekly Outflow & Dispensation Logs</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-[#1976D2] border border-blue-100/50 rounded-full">
                    7 Days Cycle
                  </span>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Total Dispensed</div>
                    <div className="text-sm font-bold text-gray-900">720 Units</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Peak Demand</div>
                    <div className="text-sm font-bold text-[#1976D2] font-mono">150 Units</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Daily Average</div>
                    <div className="text-sm font-bold text-emerald-600 font-mono">102.8 Units</div>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="relative flex-1 min-h-[160px] bg-white border border-blue-50/30 rounded-xl p-2 flex items-center justify-center">
                  <svg viewBox="0 0 500 160" className="w-full h-full">
                    {/* Grid lines */}
                    {[25, 80, 135].map((y, idx) => (
                      <line key={idx} x1="35" y1={y} x2="475" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                    ))}
                    
                    {/* Y Axis Labels */}
                    <text x="12" y="28" fontSize="8" fill="#64748B" className="font-bold font-mono">150</text>
                    <text x="12" y="83" fontSize="8" fill="#64748B" className="font-bold font-mono">75</text>
                    <text x="12" y="138" fontSize="8" fill="#64748B" className="font-bold font-mono">0</text>

                    {/* Bars Mapping */}
                    {[
                      { label: 'Mon', value: 80, x: 45, y: 135 - (80 / 150) * 110, h: (80 / 150) * 110 },
                      { label: 'Tue', value: 120, x: 108, y: 135 - (120 / 150) * 110, h: (120 / 150) * 110 },
                      { label: 'Wed', value: 95, x: 171, y: 135 - (95 / 150) * 110, h: (95 / 150) * 110 },
                      { label: 'Thu', value: 150, x: 234, y: 135 - (150 / 150) * 110, h: (150 / 150) * 110, isPeak: true },
                      { label: 'Fri', value: 110, x: 297, y: 135 - (110 / 150) * 110, h: (110 / 150) * 110 },
                      { label: 'Sat', value: 90, x: 360, y: 135 - (90 / 150) * 110, h: (90 / 150) * 110 },
                      { label: 'Sun', value: 75, x: 423, y: 135 - (75 / 150) * 110, h: (75 / 150) * 110 }
                    ].map((bar, idx) => (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredBar(bar)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {/* Background guide columns */}
                        <rect 
                          x={bar.x - 5} 
                          y="15" 
                          width="36" 
                          height="120" 
                          fill="transparent" 
                          className="hover:fill-blue-50/5" 
                        />
                        {/* The actual bar */}
                        <rect 
                          x={bar.x} 
                          y={bar.y} 
                          width="26" 
                          height={bar.h} 
                          rx="4"
                          fill={hoveredBar?.label === bar.label ? "#0D47A1" : (bar.isPeak ? "#1565C0" : "#1976D2")}
                          className="transition-all duration-200"
                        />
                        {/* Day label */}
                        <text 
                          x={bar.x + 13} 
                          y="150" 
                          textAnchor="middle" 
                          fontSize="9" 
                          fill="#475569" 
                          className="font-bold"
                        >
                          {bar.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Interactive Bar Tooltip */}
                  {hoveredBar && (
                    <div 
                      className="absolute p-2 bg-[#111827] text-white rounded-lg shadow-md text-[10px] pointer-events-none z-30"
                      style={{
                        left: `${(hoveredBar.x / 500) * 100}%`,
                        top: `${(hoveredBar.y / 160) * 80}%`,
                        transform: 'translate(-30%, -120%)'
                      }}
                    >
                      <div className="font-bold">{hoveredBar.label}</div>
                      <div className="text-blue-300 font-bold">{hoveredBar.value} Units</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Cold Chain Temperature Log Card */}
              <div className="glass-panel p-6 flex flex-col justify-between bg-white border border-blue-100 shadow-sm rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Cold Chain Temperature Log</h3>
                    <p className="text-xs text-[#374151] font-semibold">24-Hour IoT Vaccine Refrigerator Monitor</p>
                  </div>
                  {/* Status Badge */}
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> Temperature Alert
                  </span>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Current</div>
                    <div className="text-sm font-bold text-gray-900">3.9 °C</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Min</div>
                    <div className="text-sm font-bold text-emerald-600 font-mono">3.2 °C</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Max</div>
                    <div className="text-sm font-bold text-red-600 font-mono">8.5 °C</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Avg</div>
                    <div className="text-sm font-bold text-[#1976D2] font-mono">5.3 °C</div>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="relative flex-1 min-h-[160px] bg-white border border-blue-50/30 rounded-xl p-2 flex items-center justify-center">
                  <svg viewBox="0 0 500 160" className="w-full h-full">
                    {/* Safe Storage green band shading (2°C - 8°C) */}
                    <rect x="35" y="44" width="430" height="72" fill="#10B981" fillOpacity="0.05" />
                    <line x1="35" y1="44" x2="465" y2="44" stroke="#10B981" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.6" />
                    <line x1="35" y1="116" x2="465" y2="116" stroke="#10B981" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.6" />
                    
                    {/* Safe Range Labels */}
                    <text x="40" y="40" fontSize="8" fill="#10B981" className="font-bold select-none">Safe Upper Limit (8°C)</text>
                    <text x="40" y="126" fontSize="8" fill="#10B981" className="font-bold select-none">Safe Lower Limit (2°C)</text>

                    {/* Grid horizontal lines */}
                    {[20, 80, 140].map((y, idx) => (
                      <line key={idx} x1="35" y1={y} x2="465" y2={y} stroke="#E2E8F0" strokeWidth="0.5" />
                    ))}

                    {/* Draw Path */}
                    <path 
                      d="M 40 101.6 Q 82 93.8 124 86 T 208 58.4 Q 250 48.2 292 38 T 376 78.8 Q 418 86 460 93.2" 
                      fill="none" 
                      stroke="url(#tempLineGradient)" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />

                    {/* Circle data points */}
                    {[
                      { x: 40, y: 101.6, val: 3.2, time: '08:00' },
                      { x: 124, y: 86, val: 4.5, time: '10:00' },
                      { x: 208, y: 58.4, val: 6.8, time: '12:00' },
                      { x: 292, y: 38, val: 8.5, time: '14:00', isAlert: true },
                      { x: 376, y: 78.8, val: 5.1, time: '16:00' },
                      { x: 460, y: 93.2, val: 3.9, time: '18:00' }
                    ].map((pt, idx) => (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredTemp(pt)}
                        onMouseLeave={() => setHoveredTemp(null)}
                      >
                        {pt.isAlert && (
                          <circle cx={pt.x} cy={pt.y} r="8" fill="#EF4444" fillOpacity="0.2" className="animate-ping" />
                        )}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={hoveredTemp?.time === pt.time ? "6" : "4"} 
                          fill={pt.isAlert ? "#EF4444" : "#1976D2"} 
                          stroke="white" 
                          strokeWidth="2" 
                          className="transition-all duration-150"
                        />
                      </g>
                    ))}

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="tempLineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1976D2" />
                        <stop offset="50%" stopColor="#1976D2" />
                        <stop offset="58%" stopColor="#EF4444" />
                        <stop offset="70%" stopColor="#EF4444" />
                        <stop offset="80%" stopColor="#1976D2" />
                        <stop offset="100%" stopColor="#1976D2" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Interactive Tooltip */}
                  {hoveredTemp && (
                    <div 
                      className="absolute p-2 bg-[#111827] text-white rounded-lg shadow-md text-[10px] pointer-events-none z-30"
                      style={{
                        left: `${(hoveredTemp.x / 500) * 100}%`,
                        top: `${(hoveredTemp.y / 160) * 80}%`,
                        transform: 'translate(-50%, -120%)'
                      }}
                    >
                      <div className="font-bold">{hoveredTemp.time}</div>
                      <div className={hoveredTemp.isAlert ? "text-red-400 font-bold" : "text-blue-300 font-bold"}>
                        {hoveredTemp.val} °C {hoveredTemp.isAlert && "(Alert)"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Cold Chain IoT Monitor */}
            <div className="glass-panel p-6">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Live IoT Cold Chain</h3>
                <div className="space-y-4">
                    {['Warehouse A (2.4°C)', 'Transport Unit 44 (4.1°C)', 'PHC Fridge (3.8°C)'].map((s, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 flex justify-between items-center">
                            <span className="text-sm text-slate-700 dark:text-white font-medium">{s}</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* AI Demand Forecast Ledger */}
          {forecasts.length > 0 && (
            <div className="glass-panel p-6 border-blue-200 dark:border-blue-500/20">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600 dark:text-[#00F0FF]"/> AI Demand Forecast Estimates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {forecasts.map((f, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-[#081320] border border-slate-200 dark:border-white/5 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">{f.medicine}</div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">{f.days_remaining} Days <span className="text-xs font-normal text-slate-400">remaining</span></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${f.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : f.status === 'Low' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Ledger */}
          <div className="glass-panel p-6 flex-1 min-h-[300px]">
            <h3 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-[#1976D2]"/> Inventory Ledger & Expiry Alerts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-blue-50/50 border-b border-blue-100/50 text-[#111827] text-xs font-bold uppercase">
                          <th className="px-6 py-4">Medicine</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Stock Level</th>
                          <th className="px-6 py-4">Expiry</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-sm text-[#111827]">
                      {inventory.map((item, i) => (
                          <tr key={i} className={`border-b border-blue-50/50 hover:bg-blue-50/20 ${i % 2 === 1 ? 'bg-blue-50/10' : 'bg-white'}`}>
                              <td className="px-6 py-4 font-bold text-[#111827]">{item.medicine}</td>
                              <td className="px-6 py-4 text-[#374151] font-semibold">{item.location}</td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${item.stock < 20 ? 'bg-red-500' : item.stock < 50 ? 'bg-amber-500' : 'bg-[#1976D2]'}`} 
                                          style={{width: `${Math.min((item.stock / (item.capacity || 500)) * 100, 100)}%`}}
                                        ></div>
                                    </div>
                                    <span className="font-mono text-[#111827] font-bold">{item.stock}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-orange-600 font-bold font-mono">{item.expiry}</td>
                              <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                                  <button 
                                    onClick={() => { setSelectedItem(item); setModalType("dispense"); setShowModal(true); }}
                                    className="px-3 py-1 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <ArrowDownRight className="w-3.5 h-3.5"/> Dispense
                                  </button>
                                  <button 
                                    onClick={() => { setSelectedItem(item); setModalType("restock"); setShowModal(true); }}
                                    className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <ArrowUpRight className="w-3.5 h-3.5"/> Restock
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Transaction Modal Overlay */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 border border-blue-100 dark:border-white/10 relative animate-scale-up">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Box className={`w-5 h-5 ${modalType === 'dispense' ? 'text-red-500' : 'text-emerald-500'}`} />
              {modalType === 'dispense' ? 'Dispense Medicine' : 'Restock Medicine'}
            </h2>
            
            <div className="mb-4 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-300 text-sm">
              <div>Medicine: <strong className="text-slate-800 dark:text-white">{selectedItem.medicine}</strong></div>
              <div>Current Stock: <strong className="text-slate-800 dark:text-white">{selectedItem.stock}</strong></div>
            </div>

            <form onSubmit={handleAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quantity to Transaction</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className={`w-full mt-4 py-3 border rounded-xl transition-all font-semibold shadow-md cursor-pointer disabled:opacity-50 ${
                  modalType === 'dispense' 
                    ? 'bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                }`}
              >
                {submitting ? "Processing..." : modalType === 'dispense' ? "Dispense Units" : "Restock Units"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;