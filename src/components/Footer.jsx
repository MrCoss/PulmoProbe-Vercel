// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // For navigation
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'; // Social media icons

const Footer = () => {
  // Define footer links for easy management
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaGithub />, url: 'https://github.com', label: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white">PulmoProbe AI</h2>
            <p className="mt-2 text-gray-400">
              Leveraging artificial intelligence to provide early and accurate pulmonary disease predictions.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.label}
                  className="text-2xl hover:text-blue-500 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
        
        {/* Bottom Bar: Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PulmoProbe AI. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;