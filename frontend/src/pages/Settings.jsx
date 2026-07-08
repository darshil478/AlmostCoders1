import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, User, Lock, Bell, Shield, 
  Palette, Save, RefreshCw, Eye, EyeOff, Globe 
} from 'lucide-react';

export default function Settings() {
  // Profile state
  const [profile, setProfile] = useState({
    name: "Dr. Sharma",
    role: "Chief Medical Officer",
    facility: "Sector 4 Primary Health Centre",
    email: "sharma.med@healthos.org",
    phone: "+91 94321 54321"
  });

  // Security state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Notifications state
  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    inventoryStock: true,
    outbreaks: true,
    telemedicine: false
  });

  // Theme state (default: light)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply theme to document.body and documentElement
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync theme class on mount/change
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile configurations saved successfully!");
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Security keys updated.");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-200">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <SettingsIcon className="text-blue-600 dark:text-[#00F0FF]" /> System Configurations
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Configure profile settings, notification preferences, security levels, and app theme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Profile settings */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <User className="text-blue-600 dark:text-[#00F0FF]" size={18} /> Profile Information
            </h2>
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Designation / Role</label>
                <input 
                  type="text" 
                  value={profile.role} 
                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Clinical Facility</label>
                <input 
                  type="text" 
                  value={profile.facility} 
                  onChange={(e) => setProfile({...profile, facility: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Contact Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn-primary w-full md:w-auto">
                  <Save size={16} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Management */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <Lock className="text-blue-600 dark:text-[#00F0FF]" size={18} /> Password & Security
            </h2>
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-500 flex items-center gap-1.5 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} 
                  {showPassword ? "Hide Passwords" : "Show Passwords"}
                </button>
                <button type="submit" className="btn-primary">
                  <RefreshCw size={16} /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Preference Cards */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Theme Preferences */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <Palette className="text-blue-600 dark:text-[#00F0FF]" size={18} /> Theme Customization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose between the clean Medical Light theme or the cybernetic Dark theme.</p>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.06)]' 
                    : 'border-slate-200 bg-white text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="w-full h-12 bg-slate-100 rounded-lg mb-2 flex items-center justify-center font-bold text-xs shadow-inner">
                  Light Theme
                </div>
                <div className="text-center text-xs font-semibold">Medical Light</div>
              </div>
              <div 
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'border-[#00F0FF] bg-[#00F0FF]/5 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                    : 'border-slate-200 bg-white text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="w-full h-12 bg-[#081320] border border-white/5 rounded-lg mb-2 flex items-center justify-center font-bold text-xs text-[#00F0FF] shadow-inner">
                  Dark Theme
                </div>
                <div className="text-center text-xs font-semibold">Cyber Dark</div>
              </div>
            </div>
          </div>

          {/* Notification settings */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <Bell className="text-blue-600 dark:text-[#00F0FF]" size={18} /> Alert Subscriptions
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold">Critical Queue Alerts</div>
                  <div className="text-[10px] text-slate-400">Notify when waiting time exceeds 30m.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.systemAlerts}
                  onChange={(e) => setNotifications({...notifications, systemAlerts: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold">Inventory Alert levels</div>
                  <div className="text-[10px] text-slate-400">Warn on critical/low stock levels.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.inventoryStock}
                  onChange={(e) => setNotifications({...notifications, inventoryStock: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold">Surveillance Hotspots</div>
                  <div className="text-[10px] text-slate-400">Alert on suspicious symptom aggregates.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.outbreaks}
                  onChange={(e) => setNotifications({...notifications, outbreaks: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Security details */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <Shield className="text-blue-600 dark:text-[#00F0FF]" size={18} /> Security Preference
            </h2>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold">Two-Factor Authentication</div>
                <div className="text-[10px] text-slate-400">Require OTP code for administrative entries.</div>
              </div>
              <button 
                type="button"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  twoFactor 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : 'bg-slate-200 dark:bg-white/5 text-slate-500 border border-transparent'
                }`}
              >
                {twoFactor ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
