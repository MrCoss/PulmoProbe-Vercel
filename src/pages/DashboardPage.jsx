// src/pages/DashboardPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClipboard, FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Main Dashboard Component ---
const DashboardPage = ({ history = [] }) => {
  // If there's no history, show a prompt to the user.
  if (history.length === 0) {
    return <EmptyDashboard />;
  }

  // --- Calculate Live Statistics from the history prop ---
  const totalPredictions = history.length;
  const positiveCases = history.filter(p => p.output.risk.includes('High')).length;
  const modelAccuracy = 94.5; // This would still be a fixed value
  const uniqueCountries = [...new Set(history.map(p => p.inputs.country))].length;

  const stats = [
    { label: 'Total Predictions', value: totalPredictions, icon: <FiClipboard /> },
    { label: 'High-Risk Cases', value: positiveCases, icon: <FiAlertTriangle /> },
    { label: 'Model Accuracy', value: `${modelAccuracy}%`, icon: <FiCheckCircle /> },
    { label: 'Countries Analyzed', value: uniqueCountries, icon: <FiTrendingUp /> },
  ];

  // --- Prepare Live Chart Data ---
  const breakdownData = [
    { name: 'Low Risk', value: totalPredictions - positiveCases },
    { name: 'High Risk', value: positiveCases }
  ];

  const trendData = history.reduce((acc, record) => {
    const stage = record.inputs.cancer_stage;
    if (!acc[stage]) {
      acc[stage] = { name: stage, count: 0 };
    }
    acc[stage].count++;
    return acc;
  }, {});
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* ... (Header section is the same) ... */}
           <motion.div className="text-center" variants={{hidden: {opacity: 0}, visible: {opacity: 1}}}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Live Dashboard
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
              This dashboard updates in real-time with every new prediction made.
            </p>
          </motion.div>

          {/* ... (Stat cards section is the same, but now uses live data) ... */}
          <motion.div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={{hidden: {opacity: 0}, visible: {opacity: 1, transition: {staggerChildren: 0.1}}}}>
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </motion.div>

          {/* ... (Charts and Table sections updated for live data) ... */}
          <motion.div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8" variants={{hidden: {opacity: 0}, visible: {opacity: 1, transition: {staggerChildren: 0.1}}}}>
            <ChartCard title="Predictions by Cancer Stage" className="lg:col-span-3">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={Object.values(trendData)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip wrapperClassName="!rounded-md !shadow-lg !border-slate-200" cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}/>
                  <Bar dataKey="count" fill="#3b82f6" name="Predictions"/>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Risk Breakdown" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    <Cell key="cell-0" fill="#34D399" />
                    <Cell key="cell-1" fill="#EF4444" />
                  </Pie>
                  <Tooltip wrapperClassName="!rounded-md !shadow-lg !border-slate-200"/>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          <motion.div className="mt-12" variants={{hidden: {opacity: 0}, visible: {opacity: 1}}}>
             <ChartCard title="Prediction History">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-slate-200 text-sm text-slate-500">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Patient ID</th>
                        <th className="py-3 px-4 font-semibold">Age</th>
                        <th className="py-3 px-4 font-semibold">Cancer Stage</th>
                        <th className="py-3 px-4 font-semibold">Prediction</th>
                        <th className="py-3 px-4 font-semibold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice(0).reverse().map((pred) => ( // Show newest first
                        <tr key={pred.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono text-sm text-slate-600">{pred.id}</td>
                          <td className="py-3 px-4 text-slate-800">{pred.inputs.age}</td>
                          <td className="py-3 px-4 text-slate-800">{pred.inputs.cancer_stage}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${pred.output.risk.includes('High') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {pred.output.risk}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-800 font-medium">{pred.output.confidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </ChartCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const EmptyDashboard = () => (
    <div className="text-center py-20 flex flex-col items-center">
        <FiBarChart2 className="mx-auto text-6xl text-slate-300" />
        <h2 className="mt-4 text-2xl font-bold text-slate-700">Your Dashboard is Ready</h2>
        <p className="mt-2 text-slate-500 max-w-md">
            The dashboard is currently empty. Go to the homepage to make your first prediction, and the results will appear here instantly!
        </p>
        <Link to="/" className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
            Make a Prediction
        </Link>
    </div>
);
const StatCard = ({ label, value, icon }) => (
  <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
    <div className="flex justify-between items-start">
      <h3 className="text-md text-slate-500">{label}</h3>
      <div className="text-2xl text-blue-500">{icon}</div>
    </div>
    <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
  </motion.div>
);
const ChartCard = ({ title, children, className }) => (
    <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className={`bg-white p-6 rounded-xl shadow-md border border-slate-100 ${className}`}>
        <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        {children}
    </motion.div>
);

export default DashboardPage;