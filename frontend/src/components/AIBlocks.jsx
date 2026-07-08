import React from 'react';
import { Brain, TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';

// A standardized Insight Card for all modules
export const AIInsightCard = ({ title, insight, confidence, type = 'prediction' }) => (
  <div className="enterprise-card border-l-4 border-l-[#2563EB]">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <Brain className="text-[#2563EB]" size={18} />
        <h4 className="font-bold text-[#0F172A]">{title}</h4>
      </div>
      <span className="text-[10px] font-bold px-2 py-1 bg-[#DBEAFE] text-[#2563EB] rounded">
        {confidence}% CONFIDENCE
      </span>
    </div>
    <p className="text-[#334155] text-sm font-medium mb-3">{insight}</p>
    <div className="flex gap-2">
      <button className="text-[10px] uppercase font-bold text-[#2563EB]">Explainable AI</button>
    </div>
  </div>
);