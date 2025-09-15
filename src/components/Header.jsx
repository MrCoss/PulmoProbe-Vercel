// src/components/Header.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiHome, FiBarChart2, FiInfo, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', path: '/', icon: <FiHome /> },
  { name: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 /> },
  { name: 'About', path: '/about', icon: <FiInfo /> },
  { name: 'Contact', path: '/contact', icon: <FiMail /> },
];

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="sticky top-0 z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <FiActivity className="text-blue-600 text-3xl" />
            <span className="ml-2 text-xl font-bold text-slate-800">PulmoProbe</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                  } transition-colors`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;