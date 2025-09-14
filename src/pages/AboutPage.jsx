// src/pages/AboutPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTarget, FiCpu, FiCheck, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'; // Added social icons

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, ease: 'easeInOut' } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// --- Updated with your personal information ---
const creatorProfile = {
  name: 'Costas Pinto',
  role: 'UI/UX Designer & Data Scientist',
  avatar: 'https://github.com/MrCoss.png', // Using your GitHub picture for a professional look
  bio: 'As the sole creator of PulmoProbe AI, I handled all aspects of the project, from data science and model training to the UI/UX design and front-end development.',
  socials: [
    { label: 'LinkedIn', icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/costaspinto/' },
    { label: 'GitHub', icon: <FiGithub />, url: 'https://github.com/MrCoss' },
    { label: 'Email', icon: <FiMail />, url: 'mailto:costaspinto312@gmail.com' },
  ],
};

const AboutPage = () => {
  return (
    <div className="bg-slate-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 overflow-hidden">
        
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Section 1: Hero */}
          <motion.div className="text-center" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 tracking-tight">
              About PulmoProbe AI
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
              PulmoProbe AI is a solo machine learning project designed to predict lung disease outcomes based on patient data, from model conception to final UI.
            </p>
          </motion.div>

          {/* Section 2: Mission & Technology */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-start">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FiTarget size={28} /></div>
                <h3 className="text-2xl font-bold text-slate-800">My Mission</h3>
              </div>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-6">
                My core mission is to provide a powerful and accessible tool for medical research. By leveraging machine learning, I aim to uncover patterns that can aid in early detection and treatment planning.
              </p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200" variants={itemVariants}>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FiCpu size={28} /></div>
                <h3 className="text-2xl font-bold text-slate-800">Technology & Training</h3>
              </div>
              <p className="mt-4 text-slate-600">
                The project uses a **Random Forest Classifier**. The model underwent a rigorous development process:
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  { title: 'Data Preprocessing', text: 'The dataset was rigorously cleaned, handling missing values and encoding features.' },
                  { title: 'Class Balancing (SMOTE)', text: 'The SMOTE technique was applied to address class imbalance and prevent model bias.' },
                  { title: 'Hyperparameter Tuning', text: 'Extensive tuning was performed to find the optimal parameters, maximizing accuracy.' },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <FiCheck className="text-green-500 flex-shrink-0 mt-1" size={20} strokeWidth={3} />
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Section 3: About the Creator (Updated) */}
          <motion.div className="mt-28 text-center" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-slate-800">About the Creator</h2>
            <p className="mt-3 max-w-2xl mx-auto text-md text-slate-600">
              This project was brought to life by a single developer passionate about the intersection of data science and user-centric design.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-sm border border-slate-200">
                <img src={creatorProfile.avatar} alt={creatorProfile.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-slate-200" />
                <h3 className="text-xl font-semibold text-slate-900">{creatorProfile.name}</h3>
                <p className="text-blue-600 font-medium">{creatorProfile.role}</p>
                <p className="mt-4 text-slate-500 text-sm">{creatorProfile.bio}</p>
                <div className="mt-6 flex justify-center gap-6">
                  {creatorProfile.socials.map((social) => (
                    <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="text-2xl text-slate-400 hover:text-blue-600 transition-colors">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Call to Action */}
          <motion.div className="mt-28 bg-blue-600 rounded-2xl p-10 text-center text-white" variants={itemVariants}>
            <h2 className="text-3xl font-bold">Ready to See It in Action?</h2>
            <p className="mt-3 max-w-xl mx-auto">
              Explore the dashboard to use the prediction tool or get in touch for more information.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link to="/dashboard" className="px-8 py-3 font-semibold bg-white text-blue-600 rounded-lg shadow hover:bg-slate-100 transition-all">
                Go to Dashboard
              </Link>
              <Link to="/contact" className="px-8 py-3 font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all">
                Contact Me
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;