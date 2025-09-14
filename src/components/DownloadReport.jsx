// src/components/DownloadReport.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiLoader } from 'react-icons/fi'; // Import icons

const DownloadReport = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    setIsLoading(true);

    // --- Simulate fetching and preparing report data ---
    // In a real app, you would fetch data from an API here.
    setTimeout(() => {
      // 1. Create the report data (example: CSV format)
      const headers = ['PatientID', 'Prediction', 'ConfidenceScore', 'Date'];
      const data = [
        ['P001', 'Pneumonia', '88%', '2025-09-14'],
        ['P002', 'Healthy', '95%', '2025-09-14'],
        ['P003', 'Asthma', '76%', '2025-09-13'],
      ];
      let csvContent = headers.join(',') + '\n' 
                     + data.map(row => row.join(',')).join('\n');

      // 2. Create a virtual file (Blob) and a URL for it
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-s8;' });
      const url = URL.createObjectURL(blob);

      // 3. Create a hidden link to trigger the download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'PulmoProbe_Report.csv');
      document.body.appendChild(link); // Required for Firefox

      link.click(); // Simulate a click to start the download

      // 4. Clean up by removing the link and revoking the URL
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);

      setIsLoading(false);
    }, 1500); // Simulate a 1.5-second delay
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isLoading}
      className="
        flex items-center justify-center gap-2 
        px-6 py-3 mt-6 font-semibold text-white 
        bg-blue-600 rounded-lg shadow-md
        hover:bg-blue-700 focus:outline-none 
        focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
        disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-all duration-300 ease-in-out
      "
      whileHover={!isLoading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isLoading ? { scale: 0.95 } : {}}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <FiLoader className="text-xl" />
          </motion.div>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <FiDownload className="text-xl" />
          <span>Download Full Report</span>
        </>
      )}
    </motion.button>
  );
};

export default DownloadReport;