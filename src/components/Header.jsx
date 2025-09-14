// src/components/Header.jsx

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Variants for the mobile menu animation
  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, ease: 'easeInOut' } },
    exit: { opacity: 0, x: '100%' },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 shadow-md backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            PulmoProbe AI
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600
                   ${isActive ? 'text-blue-600' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <motion.span
                      layoutId="underline"
                      className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl text-gray-700"
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-white z-50 p-6 md:hidden"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl text-gray-700"
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full -mt-16 gap-8">
              {links.map((link) => (
                <motion.div key={link.name} variants={linkVariants}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-3xl font-medium transition-colors duration-300 ${
                        isActive ? 'text-blue-600' : 'text-gray-700'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;