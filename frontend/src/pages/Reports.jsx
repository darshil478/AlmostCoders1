import React from 'react';
import { FileText, Download, Printer, Share2, Filter, Search } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-200">
      {/* 1. Header & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Enterprise Reporting Module</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Generate, analyze, and distribute institutional health intelligence.</p>
        </div>
        <button className="btn-primary">
          <FileText size={18} /> Generate New Report
        </button>
      </div>

      {/* 2. Filters & Search */}
      <div className="enterprise-card flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-3.5 text-[#94A3B8]" size={16} />
          <input 
            type="text" 
            placeholder="Search reports..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <button className="btn-secondary w-full md:w-auto"><Filter size={18} /> Filters</button>
      </div>

      {/* 3. AI Executive Summary (High Priority Insight) */}
      <div className="enterprise-card border-l-4 border-l-blue-600">
        <h2 className="mb-4 text-blue-600 dark:text-[#2563EB] font-bold text-lg">AI Executive Summary</h2>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed">Based on Q3 data, revenue has grown by 12% across District Hospitals. AI recommends prioritizing budget allocation for cardiovascular diagnostics to capitalize on current patient inflow trends.</p>
      </div>

      {/* 4. Recent Reports Table */}
      <div className="enterprise-card">
        <h2 className="mb-6 text-[#111827] font-bold text-lg">Report History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50/50 border-b border-blue-100/50">
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Report Title</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Generated Date</th>
                <th className="px-6 py-4 text-[#111827] text-left font-bold text-sm">Type</th>
                <th className="px-6 py-4 text-[#111827] text-right font-bold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: "Q3 Financial Audit", date: "July 05, 2026", type: "Finance" },
                { title: "Monthly Disease Trend", date: "July 01, 2026", type: "Disease" },
                { title: "Hospital Occupancy Analysis", date: "June 28, 2026", type: "Operations" }
              ].map((rep, i) => (
                <tr key={i} className={`border-b border-blue-50/50 hover:bg-blue-50/20 ${i % 2 === 1 ? 'bg-blue-50/10' : 'bg-white'}`}>
                  <td className="px-6 py-4 font-bold text-[#111827]">{rep.title}</td>
                  <td className="px-6 py-4 text-[#374151] font-semibold">{rep.date}</td>
                  <td className="px-6 py-4 text-[#374151] font-bold">{rep.type}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                    <Download size={18} className="text-[#1976D2] cursor-pointer" />
                    <Printer size={18} className="text-gray-400 hover:text-black cursor-pointer" />
                    <Share2 size={18} className="text-gray-400 hover:text-black cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
