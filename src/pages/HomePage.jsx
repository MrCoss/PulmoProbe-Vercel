// src/pages/HomePage.jsx

import React from 'react';
import PredictionForm from '../components/PredictionForm';

const HomePage = ({ onNewPrediction }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PredictionForm onPrediction={onNewPrediction} />
    </div>
  );
};

export default HomePage;