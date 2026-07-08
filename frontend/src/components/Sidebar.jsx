import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Archive, Stethoscope, 
  BrainCircuit, BarChart3, ShieldAlert, Truck, 
  FileText, Siren, Settings, Activity, X 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Inventory', path: '/inventory', icon: Archive },
  { name: 'Doctors', path: '/doctors', icon: Stethoscope },
  { name: 'AI Intelligence', path: '/ai-intelligence', icon: BrainCircuit },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Disease Surveillance', path: '/disease-surveillance', icon: ShieldAlert },
  { name: 'Supply Chain', path: '/supply-chain', icon: Truck },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Emergency', path: '/emergency', icon: Siren, isEmergency: true },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ className = '', onClose }) => {
  return (
    <aside className={`flex-col w-72 h-screen p-4 ${className}`}>
      <div className="flex flex-col h-full overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1976D2] via-[#1565C0] to-[#0D47A1] border-none shadow-xl text-white">
        
        {/* Brand Logo Area */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <Activity className="text-white w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold tracking-wider text-white">
              MY HEALTH <span className="text-white/90">OS</span>
            </h1>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-out group border border-transparent
                ${isActive 
                  ? 'bg-white/15 text-white font-bold shadow-md shadow-black/5' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
                ${item.isEmergency ? 'hover:bg-red-500/20 text-red-200 hover:text-white' : ''}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive 
                      ? 'text-white' 
                      : (item.isEmergency ? 'text-red-300' : 'text-white/80 group-hover:text-white')
                  }`} />
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;