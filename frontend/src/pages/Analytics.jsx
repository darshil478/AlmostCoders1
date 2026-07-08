import React, { useState } from 'react';
import { 
  Download, Printer, Filter, TrendingUp, Users, Activity, 
  Bed, RefreshCw, BarChart3, ChevronRight 
} from 'lucide-react';

const chartData = [
  { day: "Mon", admissions: 120, revenue: 3.8 },
  { day: "Tue", admissions: 142, revenue: 4.5 },
  { day: "Wed", admissions: 110, revenue: 3.5 },
  { day: "Thu", admissions: 165, revenue: 5.2 },
  { day: "Fri", admissions: 130, revenue: 4.1 },
  { day: "Sat", admissions: 180, revenue: 6.0 },
  { day: "Sun", admissions: 150, revenue: 4.9 }
];

const Analytics = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeTab, setActiveTab] = useState("Weekly");

  // Chart layout calculations
  const svgWidth = 550;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Max bounds
  const maxAdmissions = 200;
  const maxRevenue = 10; // in Lakhs

  // Compute coordinates for lines
  const points = chartData.map((d, i) => {
    const x = paddingX + (i * (graphWidth / (chartData.length - 1)));
    const yAdmissions = paddingY + graphHeight - ((d.admissions / maxAdmissions) * graphHeight);
    const yRevenue = paddingY + graphHeight - ((d.revenue / maxRevenue) * graphHeight);
    return { ...d, x, yAdmissions, yRevenue, index: i };
  });

  // Generate SVG paths
  const admissionsPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yAdmissions}`).join(' ');
  const admissionsArea = `${admissionsPath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const revenuePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yRevenue}`).join(' ');

  return (
    <div className="space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* 1. Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Command Center Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time operational overview for district administration.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary"><Filter size={16} /> Filter</button>
          <button className="btn-secondary"><Download size={16} /> Export</button>
          <button className="btn-primary"><Printer size={16} /> Print</button>
        </div>
      </div>

      {/* 2. Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Admissions", val: "142", icon: Users, change: "+12.4% vs yesterday", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400" },
          { label: "ICU Occupancy", val: "84%", icon: Bed, change: "+2.1% load increase", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/10 dark:text-orange-400" },
          { label: "Revenue (INR)", val: "₹5.2L", icon: TrendingUp, change: "+8.3% from target", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400" },
          { label: "Avg. Wait Time", val: "14m", icon: Activity, change: "Optimal wait load", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/10 dark:text-cyan-400" }
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

      {/* 3. Operational & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: AI Insights */}
        <div className="lg:col-span-4 glass-panel p-6 border-l-4 border-l-[#F59E0B] flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">AI Predictive Insights</h2>
            <ul className="space-y-4">
              {[
                "Emergency cases increased by 21% over historical averages.",
                "ICU expected to reach 92% occupancy tomorrow due to seasonal fever inflows.",
                "Paracetamol demand is rising; project stock outage in 4 days."
              ].map((insight, i) => (
                <li key={i} className="p-3 bg-white border border-blue-100 rounded-xl text-[#374151] text-xs leading-relaxed flex items-start gap-2 shadow-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1976D2] mt-1.5 shrink-0"></span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t border-blue-100 mt-4 text-xs text-[#1976D2] font-bold flex items-center gap-1 cursor-pointer">
            Run Triage Analysis <ChevronRight size={14} />
          </div>
        </div>

        {/* Right: SVG Chart Area */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Revenue & Patient Trends</h2>
              <p className="text-xs text-[#374151] font-semibold">Comparing daily patient count with total revenue.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab("Weekly")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeTab === 'Weekly' ? 'bg-[#1976D2] text-white' : 'bg-blue-50 text-[#1976D2]'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setActiveTab("Monthly")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeTab === 'Monthly' ? 'bg-[#1976D2] text-white' : 'bg-blue-50 text-[#1976D2]'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="flex-1 bg-white border border-blue-100 rounded-2xl p-4 flex items-center justify-center relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-h-[220px]">
              {/* Grid Lines */}
              {[0, 1, 2, 3].map((g) => {
                const y = paddingY + (g * (graphHeight / 3));
                return (
                  <line 
                    key={g} 
                    x1={paddingX} 
                    y1={y} 
                    x2={svgWidth - paddingX} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    className="text-gray-200" 
                  />
                );
              })}

              {/* Admissions Area & Line */}
              <path d={admissionsArea} fill="url(#admissionsGradient)" />
              <path d={admissionsPath} fill="none" stroke="#1976D2" strokeWidth="2.5" strokeLinecap="round" />

              {/* Revenue Line */}
              <path d={revenuePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4,2" strokeLinecap="round" />

              {/* Interactive Circles & Trigger Areas */}
              {points.map((p) => (
                <g key={p.day}>
                  {/* Invisible broad hover trigger */}
                  <circle 
                    cx={p.x} 
                    cy={p.yAdmissions} 
                    r="15" 
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Admissions Dot */}
                  <circle 
                    cx={p.x} 
                    cy={p.yAdmissions} 
                    r={hoveredPoint?.day === p.day ? "6" : "4"} 
                    fill="#1976D2" 
                    stroke="white" 
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {/* Revenue Dot */}
                  <circle 
                    cx={p.x} 
                    cy={p.yRevenue} 
                    r={hoveredPoint?.day === p.day ? "6" : "4"} 
                    fill="#10b981" 
                    stroke="white" 
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {/* X Axis Labels */}
                  <text 
                    x={p.x} 
                    y={svgHeight - 10} 
                    textAnchor="middle" 
                    fill="currentColor" 
                    fontSize="10" 
                    className="text-gray-700 font-semibold select-none"
                  >
                    {p.day}
                  </text>
                </g>
              ))}

              {/* Gradients */}
              <defs>
                <linearGradient id="admissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1976D2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1976D2" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-4 right-4 p-4 rounded-xl bg-white border border-blue-100 shadow-md z-20 max-w-xs animate-scale-up text-xs">
                <h4 className="font-bold text-[#111827] mb-2">{hoveredPoint.day} Operations</h4>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#374151] font-semibold">Admissions:</span>
                    <span className="font-bold text-[#1976D2]">{hoveredPoint.admissions} patients</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#374151] font-semibold">Revenue:</span>
                    <span className="font-bold text-emerald-600">₹{hoveredPoint.revenue}L</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Legend */}
            <div className="absolute bottom-2 right-4 flex gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-[#1976D2]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1976D2]"></span> Admissions
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-1 border-t-2 border-dashed border-emerald-600"></span> Revenue (L)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Detailed Department Table */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Department Performance Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50/50 border-b border-blue-100/50">
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Department</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Occupancy</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Avg Time</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Performance</th>
              </tr>
            </thead>
            <tbody>
              {["Cardiology", "Neurology", "Emergency"].map((dept, i) => (
                <tr key={i} className={`border-b border-blue-50/50 hover:bg-blue-50/20 ${i % 2 === 1 ? 'bg-blue-50/10' : 'bg-white'}`}>
                  <td className="px-6 py-4 font-bold text-[#111827]">{dept}</td>
                  <td className="px-6 py-4 text-[#374151] font-semibold">78%</td>
                  <td className="px-6 py-4 text-[#374151] font-semibold">18m</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Optimized</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;