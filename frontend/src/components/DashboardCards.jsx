import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, trend, isUp, icon: Icon, color = "text-blue-600" }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-5"
  >
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-blue-50/80 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-xs font-bold ${isUp ? 'text-emerald-600' : 'text-orange-600'}`}>
        {trend}
      </span>
    </div>
    <h4 className="text-2xl font-bold text-black mb-1">{value}</h4>
    <p className="text-xs text-gray-700 font-medium tracking-wide">{title}</p>
  </motion.div>
);

export default DashboardCard;