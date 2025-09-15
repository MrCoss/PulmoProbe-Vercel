// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Layout & Page Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';

// Utility component to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [predictionHistory, setPredictionHistory] = useState([]);

  const handleNewPrediction = (predictionData) => {
    // Add a unique ID and prepend the new prediction to the history array
    const newPredictionRecord = {
      id: Date.now(),
      inputs: predictionData.inputs,
      output: {
        risk: predictionData.risk,
        confidence: predictionData.confidence,
      },
    };
    setPredictionHistory(prevHistory => [newPredictionRecord, ...prevHistory]);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onNewPrediction={handleNewPrediction} />} />
            <Route path="/dashboard" element={<DashboardPage history={predictionHistory} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;