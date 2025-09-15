// src/components/PredictionForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiThermometer,
  FiActivity,
  FiHeart,
  FiBarChart,
  FiCheckCircle,
  FiLoader,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";

const GENDERS = ["Male", "Female"];
const COUNTRIES = [
  "Sweden",
  "Netherlands",
  "Hungary",
  "Belgium",
  "Italy",
  "Croatia",
  "Denmark",
  "Germany",
  "France",
  "Slovakia",
  "Finland",
  "Spain",
  "UnitedKingdom",
  "UnitedStates",
];
const CANCER_STAGES = ["StageI", "StageII", "StageIII", "StageIV"];
const SMOKING_STATUS = [
  "NeverSmoked",
  "FormerSmoker",
  "PassiveSmoker",
  "CurrentSmoker",
];
const TREATMENT_TYPES = [
  "Chemotherapy",
  "Surgery",
  "Radiation",
  "Combined",
];

const PredictionForm = ({ onPrediction }) => {
  const [formData, setFormData] = useState({
    age: "",
    bmi: "",
    cholesterol_level: "",
    hypertension: 0,
    asthma: 0,
    cirrhosis: 0,
    other_cancer: 0,
    family_history: "No",
    gender: "",
    country: "",
    cancer_stage: "",
    smoking_status: "",
    treatment_type: "",
  });

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
    setFormData({
      age: "",
      bmi: "",
      cholesterol_level: "",
      hypertension: 0,
      asthma: 0,
      cirrhosis: 0,
      other_cancer: 0,
      family_history: "No",
      gender: "",
      country: "",
      cancer_stage: "",
      smoking_status: "",
      treatment_type: "",
    });
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- Build One-Hot Encoded Payload ---
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
      gender_Female: formData.gender === "Female" ? 1 : 0,
    };

    // --- Add One-Hot Encoding for Countries ---
    COUNTRIES.forEach((c) => {
      payload[`country_${c}`] = formData.country === c ? 1 : 0;
    });

    // --- Add One-Hot Encoding for Cancer Stage ---
    CANCER_STAGES.forEach((stage) => {
      payload[`cancer_stage_${stage}`] = formData.cancer_stage === stage ? 1 : 0;
    });

    // --- Add One-Hot Encoding for Smoking Status ---
    SMOKING_STATUS.forEach((status) => {
      payload[`smoking_status_${status}`] = formData.smoking_status === status ? 1 : 0;
    });

    // --- Add One-Hot Encoding for Treatment Type ---
    TREATMENT_TYPES.forEach((treatment) => {
      payload[`treatment_type_${treatment}`] = formData.treatment_type === treatment ? 1 : 0;
    });

    console.log("Payload being sent to API:", payload);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
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
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FiBarChart className="mr-2" /> Lung Cancer Survival Prediction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Age */}
        <div>
          <label className="block font-semibold mb-1">
            <FiUser className="inline mr-2" /> Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* BMI */}
        <div>
          <label className="block font-semibold mb-1">
            <FiThermometer className="inline mr-2" /> BMI
          </label>
          <input
            type="number"
            step="0.1"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Cholesterol Level */}
        <div>
          <label className="block font-semibold mb-1">
            <FiActivity className="inline mr-2" /> Cholesterol Level
          </label>
          <input
            type="number"
            step="0.1"
            name="cholesterol_level"
            value={formData.cholesterol_level}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Boolean fields */}
        <div className="grid grid-cols-2 gap-4">
          {["hypertension", "asthma", "cirrhosis", "other_cancer"].map((field) => (
            <label key={field} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={field}
                checked={formData[field] === 1}
                onChange={handleChange}
              />
              <span className="capitalize">{field.replace("_", " ")}</span>
            </label>
          ))}
        </div>

        {/* Family History */}
        <div>
          <label className="block font-semibold mb-1">Family History</label>
          <select
            name="family_history"
            value={formData.family_history}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Gender</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block font-semibold mb-1">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cancer Stage */}
        <div>
          <label className="block font-semibold mb-1">Cancer Stage</label>
          <select
            name="cancer_stage"
            value={formData.cancer_stage}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Stage</option>
            {CANCER_STAGES.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Smoking Status */}
        <div>
          <label className="block font-semibold mb-1">Smoking Status</label>
          <select
            name="smoking_status"
            value={formData.smoking_status}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Status</option>
            {SMOKING_STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Treatment Type */}
        <div>
          <label className="block font-semibold mb-1">Treatment Type</label>
          <select
            name="treatment_type"
            value={formData.treatment_type}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Treatment</option>
            {TREATMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Submit & Reset Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <FiLoader className="animate-spin inline-block mr-2" />
            ) : (
              <FiCheckCircle className="inline-block mr-2" />
            )}
            Predict
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            <FiRefreshCw className="inline-block mr-2" /> Reset
          </button>
        </div>
      </form>

      {/* Prediction Result */}
      <AnimatePresence>
        {prediction && (
          <motion.div
            className="mt-6 p-4 bg-gray-100 border rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="font-bold text-lg">Prediction Result:</h3>
            <p>Risk: {prediction.risk}</p>
            <p>Confidence: {prediction.confidence}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionForm;
