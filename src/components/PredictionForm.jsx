// src/components/PredictionForm.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiHeart, FiActivity, FiLoader, FiCheckCircle, FiRefreshCw, FiHash, FiThermometer, FiBarChart, FiChevronDown } from 'react-icons/fi';

// --- Data for dropdowns ---
const GENDERS = ['Male', 'Female'];
const COUNTRIES = ['Sweden', 'Netherlands', 'Hungary', 'Belgium', 'Italy', 'Croatia', 'Denmark', 'Germany', 'France', 'Slovakia', 'Finland', 'Spain'];
const CANCER_STAGES = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
const SMOKING_STATUSES = ['Never Smoked', 'Former Smoker', 'Passive Smoker', 'Current Smoker'];
const TREATMENT_TYPES = ['Chemotherapy', 'Surgery', 'Radiation', 'Combined'];

const initialState = {
  age: '', bmi: '', cholesterol_level: '', gender: GENDERS[0], country: COUNTRIES[0],
  cancer_stage: CANCER_STAGES[0], family_history: '0', smoking_status: SMOKING_STATUSES[0],
  hypertension: '0', asthma: '0', cirrhosis: '0', other_cancer: '0', treatment_type: TREATMENT_TYPES[0],
};

// --- Helper Components ---
const FormField = ({ label, error, children }) => (
  <div className="relative pb-4">
    <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
    {children}
    <AnimatePresence>
      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute mt-0.5 text-xs text-red-600">{error}</motion.p>}
    </AnimatePresence>
  </div>
);

const InputWithIcon = ({ icon, error, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input {...props} className={`w-full form-input pl-10 bg-slate-100 border-2 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-0 transition-colors duration-200 ${error && 'border-red-500'}`} />
  </div>
);

const CustomSelect = ({ error, children, ...props }) => (
  <div className="relative">
    <select {...props} className={`w-full appearance-none form-select bg-slate-100 border-2 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-0 transition-colors duration-200 ${error && 'border-red-500'}`}>
      {children}
    </select>
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
      <FiChevronDown />
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-xl text-blue-600">{icon}</div>
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
      {children}
    </div>
  </div>
);

// --- PredictionForm Component ---
const PredictionForm = ({ onPredictionComplete }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://costaspinto-pulmoprobe.hf.space/predict";

  const validateForm = () => {
    const newErrors = {};
    if (!formData.age || formData.age <= 18 || formData.age > 100) newErrors.age = 'Invalid age.';
    if (!formData.bmi || formData.bmi <= 10 || formData.bmi > 60) newErrors.bmi = 'Invalid BMI.';
    if (!formData.cholesterol_level || formData.cholesterol_level < 100 || formData.cholesterol_level > 400) newErrors.cholesterol_level = 'Invalid level.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Create a new data object with numerical values for the backend
      const requestData = {
        ...formData,
        // Convert string values to numbers for the model
        age: parseFloat(formData.age),
        bmi: parseFloat(formData.bmi),
        cholesterol_level: parseFloat(formData.cholesterol_level),
        family_history: parseInt(formData.family_history),
        hypertension: parseInt(formData.hypertension),
        asthma: parseInt(formData.asthma),
        cirrhosis: parseInt(formData.cirrhosis),
        other_cancer: parseInt(formData.other_cancer),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the pre-processed data to the backend
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server Error: ${text}`);
      }

      const data = await response.json();
      const newResult = { risk: data.risk, confidence: data.confidence };

      setResult(newResult);

      if (onPredictionComplete) {
        onPredictionComplete({
          id: `P${Date.now().toString().slice(-6)}`,
          inputs: formData,
          output: newResult,
        });
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      setResult({ risk: "Error", confidence: "0", error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border border-slate-200">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Patient Data for Prediction</h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={isLoading || result} className="space-y-8 transition-opacity duration-300 group-disabled:opacity-60 group-disabled:pointer-events-none">

          <Section title="Demographics" icon={<FiUser />}>
            <FormField label="Age" error={errors.age}><InputWithIcon name="age" type="number" value={formData.age} onChange={handleChange} icon={<FiHash size={16} />} error={errors.age} /></FormField>
            <FormField label="Body Mass Index (BMI)" error={errors.bmi}><InputWithIcon name="bmi" type="number" step="0.1" value={formData.bmi} onChange={handleChange} icon={<FiThermometer size={16} />} error={errors.bmi} /></FormField>
            <FormField label="Gender"><CustomSelect name="gender" value={formData.gender} onChange={handleChange}>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</CustomSelect></FormField>
            <FormField label="Country"><CustomSelect name="country" value={formData.country} onChange={handleChange}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</CustomSelect></FormField>
          </Section>

          <Section title="Medical History" icon={<FiHeart />}>
            <FormField label="Smoking Status"><CustomSelect name="smoking_status" value={formData.smoking_status} onChange={handleChange}>{SMOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</CustomSelect></FormField>
            <FormField label="Cholesterol Level" error={errors.cholesterol_level}><InputWithIcon name="cholesterol_level" type="number" value={formData.cholesterol_level} onChange={handleChange} icon={<FiBarChart size={16} />} error={errors.cholesterol_level} /></FormField>
            <FormField label="Family History of Cancer"><CustomSelect name="family_history" value={formData.family_history} onChange={handleChange}><option value="0">No</option><option value="1">Yes</option></CustomSelect></FormField>
            <FormField label="History of Other Cancers"><CustomSelect name="other_cancer" value={formData.other_cancer} onChange={handleChange}><option value="0">No</option><option value="1">Yes</option></CustomSelect></FormField>
          </Section>

          <Section title="Current Condition" icon={<FiActivity />}>
            <FormField label="Cancer Stage"><CustomSelect name="cancer_stage" value={formData.cancer_stage} onChange={handleChange}>{CANCER_STAGES.map(s => <option key={s} value={s}>{s}</option>)}</CustomSelect></FormField>
            <FormField label="Treatment Type"><CustomSelect name="treatment_type" value={formData.treatment_type} onChange={handleChange}>{TREATMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</CustomSelect></FormField>
            <FormField label="Hypertension"><CustomSelect name="hypertension" value={formData.hypertension} onChange={handleChange}><option value="0">No</option><option value="1">Yes</option></CustomSelect></FormField>
            <FormField label="Asthma"><CustomSelect name="asthma" value={formData.asthma} onChange={handleChange}><option value="0">No</option><option value="1">Yes</option></CustomSelect></FormField>
            <FormField label="Cirrhosis"><CustomSelect name="cirrhosis" value={formData.cirrhosis} onChange={handleChange}><option value="0">No</option><option value="1">Yes</option></CustomSelect></FormField>
          </Section>

        </fieldset>

        <div className="mt-8 pt-6 border-t border-slate-200">
          {result ? (
            <div className="text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-lg text-center ${result.risk.includes('High') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                <p className="font-bold text-lg">Prediction Result: {result.risk}</p>
                <p className="text-sm">Confidence Score: {result.confidence}%</p>
                {result.error && <p className="text-xs text-red-600 mt-1">{result.error}</p>}
              </motion.div>
              <button type="button" onClick={handleReset} className="mt-4 flex items-center justify-center gap-2 mx-auto px-5 py-2.5 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                <FiRefreshCw size={16} /> Start New Prediction
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <motion.button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 w-48 h-12 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400" whileTap={{ scale: 0.98 }}>
                {isLoading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                <span>{isLoading ? 'Predicting...' : 'Get Prediction'}</span>
              </motion.button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;