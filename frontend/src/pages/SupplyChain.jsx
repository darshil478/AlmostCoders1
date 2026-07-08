import React, { useState } from 'react';
import { Package, Thermometer, Truck, AlertTriangle, TrendingUp, ChevronRight, Info } from 'lucide-react';

const warehouseData = [
  { bay: "A", shelf: "1", fill: 85, category: "Cold Chain (Insulin)" },
  { bay: "A", shelf: "2", fill: 40, category: "Antibiotics" },
  { bay: "A", shelf: "3", fill: 95, category: "Analgesics" },
  { bay: "A", shelf: "4", fill: 15, category: "Empty / Standby" },
  { bay: "B", shelf: "1", fill: 60, category: "Surgical Supplies" },
  { bay: "B", shelf: "2", fill: 75, category: "Intravenous Fluids" },
  { bay: "B", shelf: "3", fill: 20, category: "Syringes / Needles" },
  { bay: "B", shelf: "4", fill: 50, category: "Cardiac Support" },
  { bay: "C", shelf: "1", fill: 90, category: "Hypertension Drugs" },
  { bay: "C", shelf: "2", fill: 35, category: "Expectorants" },
  { bay: "C", shelf: "3", fill: 10, category: "Empty / Standby" },
  { bay: "C", shelf: "4", fill: 80, category: "Diabetes Metformin" },
  { bay: "D", shelf: "1", fill: 45, category: "Bronchodilators" },
  { bay: "D", shelf: "2", fill: 15, category: "Anti-allergics" },
  { bay: "D", shelf: "3", fill: 70, category: "Dehydration Packs" },
  { bay: "D", shelf: "4", fill: 30, category: "Steroids" }
];

const SupplyChain = () => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Map fill level to color gradient
  const getCellColor = (fill) => {
    if (fill >= 80) return "rgba(239, 68, 68, 0.7)"; // Critical / High Load - red
    if (fill >= 50) return "rgba(249, 115, 22, 0.7)"; // Moderately full - orange
    if (fill >= 25) return "rgba(34, 197, 94, 0.7)"; // Safe levels - green
    return "rgba(59, 130, 246, 0.7)"; // Low levels - blue
  };

  const getCellBorder = (fill) => {
    if (fill >= 80) return "border-red-400";
    if (fill >= 50) return "border-orange-400";
    if (fill >= 25) return "border-green-400";
    return "border-blue-400";
  };

  return (
    <div className="space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* 1. Header & Procurement Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Supply Chain Command</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Predictive inventory management and cold-chain monitoring.</p>
        </div>
        <button className="btn-primary">Generate Procurement Order</button>
      </div>

      {/* 2. Operational KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Inventory", val: "48,200", icon: Package, change: "All units counted", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400" },
          { label: "Critical Stock Alerts", val: "12", icon: AlertTriangle, change: "Immediate orders required", color: "text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400" },
          { label: "Cold Chain Temp", val: "2.4°C", icon: Thermometer, change: "Safe storage status", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/10 dark:text-cyan-400" },
          { label: "Inventory Value", val: "₹12.4L", icon: TrendingUp, change: "Q3 audit balanced", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-slate-200/60 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{stat.val}</h3>
            <p className="text-[10px] text-slate-400 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* 3. Inventory Heatmap & Warehouse Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Heatmap */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Warehouse Utilization Overview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bay-by-bay volumetric storage tracking. Hover slots for inventory detail.</p>
          </div>
          
          <div className="flex-1 bg-slate-50/50 dark:bg-[#03060a]/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-center min-h-[300px] relative">
            
            {/* Grid display */}
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto w-full">
              {warehouseData.map((cell, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between h-20 transition-all duration-150 cursor-pointer hover:scale-105 shadow-sm ${getCellBorder(cell.fill)}`}
                  style={{ backgroundColor: getCellColor(cell.fill) }}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div className="flex justify-between items-start text-white text-[10px] font-bold">
                    <span>Bay {cell.bay}</span>
                    <span>S{cell.shelf}</span>
                  </div>
                  <div className="text-white text-right font-black text-sm">
                    {cell.fill}%
                  </div>
                </div>
              ))}
            </div>

            {/* Hover Tooltip Overlay */}
            {hoveredCell ? (
              <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg z-20 max-w-xs animate-scale-up text-xs">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
                  <Package size={14} className="text-blue-600" /> Storage Block {hoveredCell.bay}-{hoveredCell.shelf}
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Utilization:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{hoveredCell.fill}% capacity</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Stored Cargo:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{hoveredCell.category}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                <Info size={12} /> Hover grid cells to inspect specific pharmaceutical sectors.
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex gap-3 text-[9px] font-bold">
              <span className="flex items-center gap-1 text-red-500">
                <span className="w-2 h-2 rounded bg-red-500 opacity-70"></span> &gt;80%
              </span>
              <span className="flex items-center gap-1 text-orange-500">
                <span className="w-2 h-2 rounded bg-orange-500 opacity-70"></span> &gt;50%
              </span>
              <span className="flex items-center gap-1 text-green-500">
                <span className="w-2 h-2 rounded bg-green-500 opacity-70"></span> &gt;25%
              </span>
              <span className="flex items-center gap-1 text-blue-500">
                <span className="w-2 h-2 rounded bg-blue-500 opacity-70"></span> &lt;25%
              </span>
            </div>
          </div>
        </div>

        {/* Right: AI Procurement Recs */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">AI Procurement Recs</h2>
            <div className="space-y-4">
              {[
                { item: "Azithromycin 500mg", action: "Order 500 units immediately (critical stock: 15)", state: "Urgent" },
                { item: "Insulin Glargine 100 IU", action: "Cold chain level drops; order 100 vials (stock: 35)", state: "High Priority" }
              ].map((rec, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{rec.item}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.state === 'Urgent' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    }`}>{rec.state}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 mt-4 text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer">
            View All Procurement Inflow <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* 4. Critical Alerts & Delivery Tracking */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Delivery Tracking & Alerts</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50/50 border-b border-blue-100/50">
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Shipment ID</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Status</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">ETA</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "ORD-9921", status: "In Transit", eta: "2 hours", color: "text-[#1976D2]" },
                { id: "ORD-8834", status: "Delayed", eta: "5 hours", color: "text-red-600" }
              ].map((row, i) => (
                <tr key={i} className={`border-b border-blue-50/50 hover:bg-blue-50/20 ${i % 2 === 1 ? 'bg-blue-50/10' : 'bg-white'}`}>
                  <td className="px-6 py-4 font-bold text-[#111827]">{row.id}</td>
                  <td className="px-6 py-4 text-[#374151] font-semibold">{row.status}</td>
                  <td className={`px-6 py-4 font-bold ${row.color}`}>{row.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;