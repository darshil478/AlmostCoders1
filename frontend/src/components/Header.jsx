import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Plus, AlertTriangle, User, ShieldCheck, Trash2, X } from 'lucide-react';
import { getNotifications, clearNotifications } from '../api/analytics';

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications in header:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAll = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
      setShowDropdown(false);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-24 px-6 py-4 flex items-center justify-between w-full bg-white border-b border-blue-50 relative z-30">
      
      {/* Left: District & Health Score */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-black tracking-wide">
            Sigma District <span className="text-gray-500 font-normal text-lg">Command</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium tracking-widest uppercase mt-1">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span className="text-sm font-semibold text-[#10B981]">System Optimal</span>
        </div>
      </div>

      {/* Center: Global Search (Command Palette Concept) */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 group-focus-within:text-blue-700 transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients, doctors, or inventory... (Press ⌘K)" 
            className="w-full bg-[#F2F8FF] border border-blue-100 rounded-2xl py-3 pl-11 pr-4 text-sm text-black placeholder-gray-500 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 relative">
        {/* Clock */}
        <div className="hidden xl:block text-right mr-4">
          <div className="text-xl font-medium text-blue-900 font-mono tracking-wider">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>

        {/* Quick Actions */}
        <button className="p-3 rounded-xl bg-white border border-blue-100 text-blue-900 hover:bg-blue-50 transition-all cursor-pointer">
          <Plus className="w-5 h-5 text-blue-900" />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-3 rounded-xl bg-white border border-blue-100 text-blue-900 hover:bg-blue-50 transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5 text-blue-900" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 glass-card border border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.08)] z-50 rounded-2xl p-4 animate-scale-up">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-blue-50">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600"/> Alerts ({notifications.length})
                </h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-gray-400 text-center py-6 text-xs">No active alerts</div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        n.type === 'danger' ? 'bg-red-50 border-red-100 text-red-700' :
                        n.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                        'bg-slate-50 border-slate-100 text-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-semibold">{n.message}</span>
                        <span className="text-[10px] text-gray-400 font-mono shrink-0">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Emergency Button */}
        <button className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-sm cursor-pointer">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">CRITICAL</span>
        </button>

        {/* Profile */}
        <button className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-all cursor-pointer">
          <User className="w-5 h-5 text-blue-900" />
        </button>
      </div>

    </header>
  );
};

export default Header;