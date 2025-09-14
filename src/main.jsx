// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

// The BrowserRouter is now inside App.jsx, so we don't need it here.
// This file's only job is to render the main App component into the DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);