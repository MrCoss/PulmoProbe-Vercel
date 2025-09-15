// src/components/PredictionForm.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiActivity, FiCheckCircle, FiLoader, FiRefreshCw, FiHeart, FiChevronDown } from "react-icons/fi";

// --- Feature Lists ---
const GENDERS = ["Male", "Female"];
const COUNTRIES = ["Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];
const CANCER_STAGES = ["Stage_II", "Stage_III", "Stage_IV"];
const SMOKING_STATUS = ["Never_Smoked", "Former_Smoker", "Passive_Smoker"];
const TREATMENT_TYPES = ["Combined", "Radiation", "Surgery"];

const initialState = {
  age: "", bmi: "", cholesterol_level: "",
  hypertension: 0, asthma: 0, cirrhosis: 0, other_cancer: 0,
  family_history: "No", gender: GENDERS[0], country: COUNTRIES[0],
  cancer_stage: CANCER_STAGES[0], smoking_status: SMOKING_STATUS[0], treatment_type: TREATMENT_TYPES[0]
};

// --- Helper function for one-hot encoding ---
const oneHotEncode = (value, allValues, prefix) => {
  const obj = {};
  allValues.forEach(v => {
    const key = `${prefix}_${v.replace(/ /g, "_")}`;
    obj[key] = value === v ? 1 : 0;
  });
  return obj;
};

// --- Components ---
const Section = ({ title, icon, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
    <div className="flex items-center gap-4 mb-6">
      <div className="text-3xl text-blue-600">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">{children}</div>
  </motion.div>
);

const FormField = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
    <input {...props} className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 text-gray-800 transition-colors" />
  </div>
);

const Select = ({ icon, children, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><FiChevronDown /></div>
    <select {...props} className="w-full pl-3 pr-8 py-2 bg-slate-100 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 text-gray-800 appearance-none transition-colors">{children}</select>
  </div>
);

// --- Prediction Form ---
const PredictionForm = ({ onPrediction }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? (checked ? 1 : 0) : value });
  };

  const resetForm = () => { setFormData(initialState); setPrediction(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    const payload = {
      age: Number(formData.age),
      bmi: Number(formData.bmi),
      cholesterol_level: Number(formData.cholesterol_level),
      hypertension: formData.hypertension,
      asthma: formData.asthma,
      cirrhosis: formData.cirrhosis,
      other_cancer: formData.other_cancer,
      gender_Male: formData.gender === "Male" ? 1 : 0,
      family_history_Yes: formData.family_history === "Yes" ? 1 : 0,
      ...oneHotEncode(formData.country, COUNTRIES, "country"),
      ...oneHotEncode(formData.cancer_stage, CANCER_STAGES, "cancer_stage"),
      ...oneHotEncode(formData.smoking_status, SMOKING_STATUS, "smoking_status"),
      ...oneHotEncode(formData.treatment_type, TREATMENT_TYPES, "treatment_type")
    };

    try {
      const response = await fetch("https://costaspinto-pulmoprobe.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${text}`);
      }
      const result = await response.json();
      setPrediction(result);

      if (onPrediction) {
        onPrediction({
          ...result,
          inputs: formData
        });
      }
    } catch (err) {
      setPrediction({ risk: "Error", confidence: "0%", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 md:p-12 rounded-3xl shadow-xl w-full max-w-4xl mx-auto border border-gray-200">
      <h2 className="text-4xl font-extrabold text-center text-slate-800 mb-10">PulmoProbe: Lung Cancer Prognosis</h2>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Demographics */}
        <Section title="Demographics" icon={<FiUser />}>
          <FormField label="Age"><Input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 55" min="18" max="100" required /></FormField>
          <FormField label="BMI"><Input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} placeholder="e.g. 22.5" min="10" max="60" required /></FormField>
          <FormField label="Cholesterol"><Input type="number" name="cholesterol_level" value={formData.cholesterol_level} onChange={handleChange} placeholder="e.g. 180" min="100" max="400" required /></FormField>
          <FormField label="Gender"><Select name="gender" value={formData.gender} onChange={handleChange} required>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</Select></FormField>
          <FormField label="Country"><Select name="country" value={formData.country} onChange={handleChange} required>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</Select></FormField>
        </Section>

        {/* Medical History */}
        <Section title="Medical History" icon={<FiHeart />}>
          {["hypertension", "asthma", "cirrhosis", "other_cancer"].map(cond => (
            <FormField key={cond} label={cond.replace(/_/g, " ")}>
              <label className="inline-flex items-center">
                <input type="checkbox" name={cond} checked={formData[cond] === 1} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
            </FormField>
          ))}
          <FormField label="Family History">
            <Select name="family_history" value={formData.family_history} onChange={handleChange} required>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </Select>
          </FormField>
          <FormField label="Smoking Status">
            <Select name="smoking_status" value={formData.smoking_status} onChange={handleChange} required>
              {SMOKING_STATUS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </Select>
          </FormField>
        </Section>

        {/* Current Condition */}
        <Section title="Current Condition" icon={<FiActivity />}>
          <FormField label="Cancer Stage">
            <Select name="cancer_stage" value={formData.cancer_stage} onChange={handleChange} required>
              {CANCER_STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </Select>
          </FormField>
          <FormField label="Treatment Type">
            <Select name="treatment_type" value={formData.treatment_type} onChange={handleChange} required>
              {TREATMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormField>
        </Section>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-200">
          <motion.button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-56 h-12 font-semibold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors" whileTap={{ scale: 0.98 }}>
            {loading ? <FiLoader className="animate-spin text-xl" /> : <FiCheckCircle className="text-xl" />}
            {loading ? "Predicting..." : "Get Prediction"}
          </motion.button>
          <motion.button type="button" onClick={resetForm} className="flex items-center justify-center gap-2 w-56 h-12 font-semibold text-slate-700 bg-slate-200 rounded-xl shadow-md hover:bg-slate-300 transition-colors" whileTap={{ scale: 0.98 }}>
            <FiRefreshCw className="text-xl" />Reset Form
          </motion.button>
        </div>
      </form>

      {/* Prediction Result */}
      <AnimatePresence>
        {prediction && (
          <motion.div className={`mt-10 p-8 rounded-xl border-4 ${prediction.risk.includes("High") ? "bg-red-50 text-red-800 border-red-300" : "bg-green-50 text-green-800 border-green-300"}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-3xl">
                {prediction.risk.includes("High") ? <FiActivity /> : <FiCheckCircle />}
              </div>
              <h3 className="font-bold text-2xl">Prediction Result</h3>
            </div>
            <p className="text-lg"><strong>Risk:</strong> {prediction.risk}</p>
            <p className="text-lg"><strong>Confidence:</strong> {prediction.confidence}</p>
            {prediction.error && <p className="text-sm text-red-600 mt-2">Error: {prediction.error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionForm;