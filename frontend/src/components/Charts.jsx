import React from 'react';

const Charts = ({ title, data, type = 'bar', color = "#2F80ED" }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="glass-panel p-6 flex flex-col h-full hover:border-[#66A8FF]/50 transition-all">
      <h3 className="text-sm font-bold text-[#5F728C] uppercase tracking-wider mb-6">{title}</h3>
      <div className="flex-1 flex items-end justify-between gap-3 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            <div 
              className={`w-full rounded-t-lg transition-all duration-700 ease-out`}
              style={{ 
                height: `${(d.value / maxValue) * 100}%`,
                background: type === 'bar' ? `linear-gradient(to top, ${color}88, ${color})` : 'transparent'
              }}
            >
              {type === 'line' && <div className="w-full h-1" style={{ backgroundColor: color, boxShadow: `0 2px 8px ${color}66` }}></div>}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#8DA2B8] mt-2">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Charts;