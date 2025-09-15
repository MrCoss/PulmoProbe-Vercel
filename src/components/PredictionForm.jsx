// src/components/PredictionForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiThermometer,
  FiActivity,
  FiCheckCircle,
  FiLoader,
  FiRefreshCw,
  FiBarChart,
  FiHeart,
  FiChevronDown,
} from "react-icons/fi";

// --- Data for dropdowns ---
const GENDERS = ["Male", "Female"];
const COUNTRIES = [
  "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania",
  "Slovakia", "Slovenia", "Spain", "Sweden"
];
// Corrected to match the model's feature names
const CANCER_STAGES = ["Stage Ii", "Stage Iii", "Stage Iv"];
const SMOKING_STATUS = ["Never Smoked", "Former Smoker", "Passive Smoker"];
const TREATMENT_TYPES = ["Combined", "Radiation", "Surgery"];

const initialState = {
  age: "",
  bmi: "",
  cholesterol_level: "",
  hypertension: 0,
  asthma: 0,
  cirrhosis: 0,
  other_cancer: 0,
  family_history: "No",
  gender: GENDERS[0],
  country: COUNTRIES[0],
  cancer_stage: CANCER_STAGES[0],
  smoking_status: SMOKING_STATUS[0],
  treatment_type: TREATMENT_TYPES[0],
};

// Helper function to map a value to a one-hot encoded object
const oneHotEncode = (value, prefix, allValues) => {
  const obj = {};
  allValues.forEach(val => {
    // Correctly handle spaces and capitalization
    const key = `${prefix}_${val}`;
    obj[key] = value === val ? 1 : 0;
  });
  return obj;
};

// --- Helper Components ---
const Section = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl text-blue-600">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      {children}
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      className="w-full form-input pl-10 pr-3 py-2 bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 text-gray-800"
    />
  </div>
);

const Select = ({ icon, children, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <select
      {...props}
      className="w-full appearance-none form-select pl-10 pr-8 py-2 bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 text-gray-800"
    >
      {children}
    </select>
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
      <FiChevronDown />
    </div>
  </div>
);

// --- PredictionForm Component ---
const PredictionForm = ({ onPrediction }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const resetForm = () => {
    setFormData(initialState);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      age: parseFloat(formData.age),
      bmi: parseFloat(formData.bmi),
      cholesterol_level: parseFloat(formData.cholesterol_level),
      hypertension: formData.hypertension,
      asthma: formData.asthma,
      cirrhosis: formData.cirrhosis,
      other_cancer: formData.other_cancer,
      family_history_Yes: formData.family_history === "Yes" ? 1 : 0,
      gender_Male: formData.gender === "Male" ? 1 : 0,
    };

    COUNTRIES.forEach((c) => {
      payload[`country_${c}`] = formData.country === c ? 1 : 0;
    });
    // This is the key change to match the backend
    CANCER_STAGES.forEach((stage) => {
      payload[`cancer_stage_${stage}`] = formData.cancer_stage === stage ? 1 : 0;
    });
    SMOKING_STATUS.forEach((status) => {
      payload[`smoking_status_${status}`] = formData.smoking_status === status ? 1 : 0;
    });
    TREATMENT_TYPES.forEach((treatment) => {
      payload[`treatment_type_${treatment}`] = formData.treatment_type === treatment ? 1 : 0;
    });

    console.log("Payload sent to API:", payload);

    try {
      const response = await fetch("https://costaspinto-pulmoprobe.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setPrediction(result);
      if (onPrediction) onPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border border-slate-200">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Lung Cancer Survival Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Demographics Section */}
        <Section title="Demographics" icon={<FiUser />}>
          <FormField label="Age (18-100)">
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 55"
              min="18"
              max="100"
              required
            />
          </FormField>
          <FormField label="BMI (10-60)">
            <Input
              type="number"
              step="0.1"
              name="bmi"
              value={formData.bmi}
              onChange={handleChange}
              placeholder="e.g. 22.5"
              min="10"
              max="60"
              required
            />
          </FormField>
          <FormField label="Cholesterol Level (100-400)">
            <Input
              type="number"
              name="cholesterol_level"
              value={formData.cholesterol_level}
              onChange={handleChange}
              placeholder="e.g. 180"
              min="100"
              max="400"
              required
            />
          </FormField>
          <FormField label="Gender">
            <Select name="gender" value={formData.gender} onChange={handleChange} required>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Country">
            <Select name="country" value={formData.country} onChange={handleChange} required>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FormField>
        </Section>

        {/* Medical History Section */}
        <Section title="Medical History" icon={<FiHeart />}>
          <FormField label="Hypertension">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="hypertension"
                checked={formData.hypertension === 1}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
          </FormField>
          <FormField label="Asthma">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="asthma"
                checked={formData.asthma === 1}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
          </FormField>
          <FormField label="Cirrhosis">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="cirrhosis"
                checked={formData.cirrhosis === 1}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
          </FormField>
          <FormField label="Other Cancer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="other_cancer"
                checked={formData.other_cancer === 1}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
          </FormField>
          <FormField label="Family History">
            <Select name="family_history" value={formData.family_history} onChange={handleChange} required>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </Select>
          </FormField>
          <FormField label="Smoking Status">
            <Select name="smoking_status" value={formData.smoking_status} onChange={handleChange} required>
              {SMOKING_STATUS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </FormField>
        </Section>

        {/* Current Condition Section */}
        <Section title="Current Condition" icon={<FiActivity />}>
          <FormField label="Cancer Stage">
            <Select name="cancer_stage" value={formData.cancer_stage} onChange={handleChange} required>
              {CANCER_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Treatment Type">
            <Select name="treatment_type" value={formData.treatment_type} onChange={handleChange} required>
              {TREATMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </FormField>
        </Section>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          <motion.button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-48 h-12 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
            <span>{loading ? "Predicting..." : "Get Prediction"}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={resetForm}
            className="flex items-center justify-center gap-2 w-48 h-12 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <FiRefreshCw />
            <span>Reset Form</span>
          </motion.button>
        </div>
      </form>

      {/* Prediction Result Display */}
      <AnimatePresence>
        {prediction && (
          <motion.div
            className={`mt-8 p-6 rounded-lg shadow-md border ${
              prediction.risk === "High Risk of Non-Survival" ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="font-bold text-xl mb-2">Prediction Result</h3>
            <p><strong>Risk:</strong> {prediction.risk}</p>
            <p><strong>Confidence:</strong> {prediction.confidence}</p>
            {prediction.error && <p className="text-sm text-red-600 mt-2">Error: {prediction.error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionForm;