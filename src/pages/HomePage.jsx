// src/pages/HomePage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PredictionForm from '../components/PredictionForm';
import { FiCpu, FiBarChart2, FiShield, FiPlayCircle } from 'react-icons/fi';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// --- Data for Features Section ---
const features = [
  {
    icon: <FiCpu />,
    title: 'Advanced AI Model',
    description: 'Utilizes a fine-tuned Random Forest model for high-precision analysis of complex patient data.',
  },
  {
    icon: <FiBarChart2 />,
    title: 'Instantaneous Results',
    description: 'Receive immediate risk assessments and confidence scores without any waiting period.',
  },
  {
    icon: <FiShield />,
    title: 'Secure & Anonymous',
    description: 'Your data is processed securely. We are committed to ensuring patient data privacy and anonymity.',
  },
];

// --- Updated HomePage Component ---
const HomePage = ({ onNewPrediction }) => { // Accept the onNewPrediction function as a prop
  return (
    <div className="bg-white">
      {/* Section 1: Hero */}
      <div className="relative bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent"
            >
              PulmoProbe AI
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600"
            >
              A comprehensive and intelligent tool for early-stage lung disease prediction.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-10 flex justify-center gap-4 flex-wrap"
            >
              <a
                href="#prediction-form"
                className="flex items-center gap-2 px-8 py-3 font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                <FiPlayCircle />
                Start Prediction
              </a>
              <Link
                to="/about"
                className="px-8 py-3 font-semibold bg-white text-blue-600 rounded-lg border border-slate-300 hover:bg-slate-100 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section 2: Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">Why Choose PulmoProbe AI?</h2>
            <p className="mt-3 max-w-2xl mx-auto text-md text-slate-500">
              We provide a powerful, data-driven approach to risk assessment.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Prediction Form */}
      <div id="prediction-form" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            {/* This is the key change to make the dashboard work */}
            <PredictionForm onPredictionComplete={onNewPrediction} />
          </motion.div>
        </div>
      </div>

       {/* Section 4: Final CTA to Dashboard */}
      <div className="bg-white py-20">
         <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800">Explore the Full Picture</h2>
            <p className="mt-3 text-md text-slate-500">
                Dive deeper into model statistics, prediction trends, and detailed performance metrics on our interactive dashboard.
            </p>
            <div className="mt-8">
                <Link
                    to="/dashboard"
                    className="px-8 py-3 font-semibold bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-900 transition-all"
                >
                    View Dashboard
                </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HomePage;