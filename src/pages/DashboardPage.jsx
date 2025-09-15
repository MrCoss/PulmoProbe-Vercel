// src/pages/DashboardPage.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClipboard, FiAlertTriangle, FiCheckCircle, FiGlobe, FiBarChart2 } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --- UI Components ---
const DashboardHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
      Live Dashboard
    </h1>
    <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
      This dashboard updates in real-time with every new prediction made.
    </p>
  </motion.div>
);

const StatCard = ({ label, value, icon, variants }) => (
  <motion.div variants={variants} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
    <div className="flex justify-between items-start">
      <h3 className="text-md text-slate-500">{label}</h3>
      <div className="text-2xl text-blue-500">{icon}</div>
    </div>
    <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
  </motion.div>
);

const ChartCard = ({ title, children, className, variants }) => (
  <motion.div variants={variants} className={`bg-white p-6 rounded-xl shadow-md border border-slate-100 ${className}`}>
    <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
    {children}
  </motion.div>
);

const TableRow = ({ pred }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors"
  >
    <td className="py-3 px-4 font-mono text-sm text-slate-600">{pred.id}</td>
    <td className="py-3 px-4 text-slate-800">{pred.inputs.age}</td>
    <td className="py-3 px-4 text-slate-800">{pred.inputs.cancer_stage.replace(/_/g," ")}</td>
    <td className="py-3 px-4">
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          pred.output.risk.includes("High") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}
      >
        {pred.output.risk}
      </span>
    </td>
    <td className="py-3 px-4 text-slate-800 font-medium">{pred.output.confidence}</td>
  </motion.tr>
);

const EmptyDashboard = () => (
  <div className="text-center py-20 flex flex-col items-center">
    <FiBarChart2 className="mx-auto text-7xl text-slate-300" />
    <h2 className="mt-4 text-3xl font-bold text-slate-700">Your Dashboard is Ready</h2>
    <p className="mt-2 text-slate-500 max-w-md">
      The dashboard is currently empty. Make your first prediction and the results will appear here instantly!
    </p>
  </div>
);

// --- Main Dashboard Component ---
const DashboardPage = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
          <EmptyDashboard />
        </div>
      </div>
    );
  }

  const totalPredictions = history.length;
  const highRiskCases = history.filter((p) => p.output.risk.includes("High")).length;
  const modelAccuracy = 94.5;
  const uniqueCountries = [...new Set(history.map((p) => p.inputs.country))].length;

  const stats = [
    { label: "Total Predictions", value: totalPredictions, icon: <FiClipboard /> },
    { label: "High-Risk Cases", value: highRiskCases, icon: <FiAlertTriangle /> },
    { label: "Model Accuracy", value: `${modelAccuracy}%`, icon: <FiCheckCircle /> },
    { label: "Countries Analyzed", value: uniqueCountries, icon: <FiGlobe /> },
  ];

  const breakdownData = [
    { name: "Low Risk", value: totalPredictions - highRiskCases },
    { name: "High Risk", value: highRiskCases },
  ];

  const trendData = history.reduce((acc, record) => {
    const stage = record.inputs.cancer_stage;
    if (!acc[stage]) acc[stage] = { name: stage.replace(/_/g, ' '), count: 0 };
    acc[stage].count++;
    return acc;
  }, {});

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Stat Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                {...stat}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              />
            ))}
          </div>

          {/* Charts */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
            <ChartCard title="Predictions by Cancer Stage" className="lg:col-span-3">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={Object.values(trendData)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Risk Breakdown" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    <Cell fill="#34D399" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Prediction History Table */}
          <ChartCard title="Prediction History" className="mt-12">
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
                  <AnimatePresence>
                    {history.map((pred) => (
                      <TableRow key={pred.id} pred={pred} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </ChartCard>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;