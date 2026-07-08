import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { Bot, Menu } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-white text-black dark:text-black">
      {/* Sidebar: Hidden on Mobile, Flex on Desktop */}
      <Sidebar className="hidden md:flex" />

      <div className="relative flex flex-col flex-1 overflow-hidden">
        {/* Header: Adds a Hamburger Menu for mobile */}
        <Header />

        <main className="w-full h-full overflow-y-auto p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto w-full pb-24"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Responsive Floating AI Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 md:p-4 rounded-2xl glass-card bg-white border border-blue-100 shadow-lg shadow-blue-500/5 z-50 cursor-pointer"
        >
          <Bot className="w-6 h-6 text-blue-600" />
        </motion.button>
      </div>
    </div>
  );
};

export default Layout;