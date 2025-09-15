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
} from "react-icons/fi";

//
// --- Constants for Dropdowns ---
//
const GENDERS = ["Male", "Female"];

const COUNTRIES = [
  "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania",
  "Slovakia", "Slovenia", "Spain", "Sweden"
];

const CANCER_STAGES = ["Stage Ii", "Stage Iii", "Stage Iv"];

const SMOKING_STATUS = [
  "Never Smoked",
  "Former Smoker",
  "Passive Smoker",
];

const TREATMENT_TYPES = ["Combined", "Radiation", "Surgery"];

//
// --- Component ---
//
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

  //
  // Handle form input changes
  //
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  //
  // Reset form
  //
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

  //
  // Prepare payload and submit
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      // Numeric
      age: parseFloat(formData.age),
      bmi: parseFloat(formData.bmi),
      cholesterol_level: parseFloat(formData.cholesterol_level),

      // Binary
      hypertension: formData.hypertension,
      asthma: formData.asthma,
      cirrhosis: formData.cirrhosis,
      other_cancer: formData.other_cancer,

      // Family History
      family_history_Yes: formData.family_history === "Yes" ? 1 : 0,

      // Gender
      gender_Male: formData.gender === "Male" ? 1 : 0,
    };

    // --- One-hot encode countries ---
    COUNTRIES.forEach((c) => {
      payload[`country_${c}`] = formData.country === c ? 1 : 0;
    });

    // --- One-hot encode cancer stages ---
    CANCER_STAGES.forEach((stage) => {
      payload[`cancer_stage_${stage}`] = formData.cancer_stage === stage ? 1 : 0;
    });

    // --- One-hot encode smoking status ---
    SMOKING_STATUS.forEach((status) => {
      payload[`smoking_status_${status}`] = formData.smoking_status === status ? 1 : 0;
    });

    // --- One-hot encode treatment types ---
    TREATMENT_TYPES.forEach((treatment) => {
      payload[`treatment_type_${treatment}`] = formData.treatment_type === treatment ? 1 : 0;
    });

    console.log("Payload sent to API:", payload);

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

  //
  // UI Component
  //
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
        <FiBarChart className="mr-3 text-blue-600" /> Lung Cancer Survival Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Numeric Inputs with range helper --- */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FiUser className="inline mr-2 text-blue-600" /> Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age (18-100)"
            min="18"
            max="100"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FiThermometer className="inline mr-2 text-blue-600" /> BMI
          </label>
          <input
            type="number"
            step="0.1"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            placeholder="e.g. 22.5"
            min="10"
            max="50"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <FiActivity className="inline mr-2 text-blue-600" /> Cholesterol Level
          </label>
          <input
            type="number"
            step="0.1"
            name="cholesterol_level"
            value={formData.cholesterol_level}
            onChange={handleChange}
            placeholder="e.g. 180"
            min="100"
            max="400"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* --- Boolean toggles --- */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Medical History
          </label>
          <div className="grid grid-cols-2 gap-4">
            {["hypertension", "asthma", "cirrhosis", "other_cancer"].map((field) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={field}
                  checked={formData[field] === 1}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="capitalize">{field.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Family History */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Family History</label>
          <select
            name="family_history"
            value={formData.family_history}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-semibold mb-2">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-semibold mb-2">Cancer Stage</label>
          <select
            name="cancer_stage"
            value={formData.cancer_stage}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-semibold mb-2">Smoking Status</label>
          <select
            name="smoking_status"
            value={formData.smoking_status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-semibold mb-2">Treatment Type</label>
          <select
            name="treatment_type"
            value={formData.treatment_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Treatment</option>
            {TREATMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Submit & Reset */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            <FiRefreshCw className="inline-block mr-2" /> Reset
          </button>
        </div>
      </form>

      {/* --- Prediction Result --- */}
      <AnimatePresence>
        {prediction && (
          <motion.div
            className="mt-8 p-6 bg-gray-100 border rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="font-bold text-lg">Prediction Result</h3>
            <p className="mt-2 text-gray-700">
              <strong>Risk:</strong> {prediction.risk}
            </p>
            <p className="text-gray-700">
              <strong>Confidence:</strong> {prediction.confidence}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionForm;
