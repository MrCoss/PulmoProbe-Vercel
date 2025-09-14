// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiLoader, FiCheck, FiSend } from 'react-icons/fi';

// --- Personalized Contact Details ---
const contactDetails = [
    { icon: <FiMail />, title: 'Email', detail: 'costaspinto312@gmail.com', url: 'mailto:costaspinto312@gmail.com' },
    { icon: <FiLinkedin />, title: 'LinkedIn', detail: 'Connect with me', url: 'https://www.linkedin.com/in/costaspinto/' },
    { icon: <FiGithub />, title: 'GitHub', detail: 'View my projects', url: 'https://github.com/MrCoss' },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('sending');
    try {
      const response = await fetch('https://formspree.io/f/YOUR_UNIQUE_ID', { // Remember to replace with your ID
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* --- Header --- */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Get in Touch</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Have a question, a project idea, or just want to connect? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* --- Left Column: Contact Info --- */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
                <div className="space-y-6">
                    {contactDetails.map(item => (
                        <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all duration-300">
                            <div className="text-2xl text-blue-500 mr-5">{item.icon}</div>
                            <div>
                                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                                <p className="text-slate-500">{item.detail}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </motion.div>

            {/* --- Right Column: Form --- */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } }}
              className="bg-white p-8 rounded-xl shadow-lg border border-slate-200"
            >
              {status === 'success' ? (
                <div className="text-center py-10">
                  <FiCheck className="mx-auto text-6xl text-green-500" />
                  <h3 className="mt-4 text-2xl font-bold text-slate-800">Message Sent!</h3>
                  <p className="mt-2 text-slate-600">Thank you for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Send Me a Message</h2>
                  {/* --- Floating Label Input Fields --- */}
                  <FloatingLabelInput id="name" type="text" value={formData.name} onChange={handleChange} error={errors.name} label="Full Name" />
                  <FloatingLabelInput id="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} label="Email Address" />
                  <FloatingLabelInput id="message" isTextarea={true} value={formData.message} onChange={handleChange} error={errors.message} label="Your Message" />
                  
                  {status === 'error' && <p className="text-red-600 text-center">Something went wrong. Please try again.</p>}

                  <motion.button type="submit" disabled={status === 'sending'} className="w-full h-12 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-slate-400 flex items-center justify-center gap-2" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    {status === 'sending' ? <FiLoader className="animate-spin" /> : <FiSend />}
                    <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
                  </motion.button>
                </form>
              )}
            </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Component for Floating Label Inputs ---
const FloatingLabelInput = ({ id, type, value, onChange, error, label, isTextarea = false }) => {
    const InputComponent = isTextarea ? 'textarea' : 'input';
    return (
        <div className="relative">
            <InputComponent
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" " // Required for the peer magic
                className={`peer w-full px-4 pt-6 pb-2 bg-slate-100 border-2 rounded-md transition-colors ${error ? 'border-red-500' : 'border-transparent'} focus:ring-0 focus:outline-none focus:border-blue-500 ${isTextarea && 'h-36 resize-none'}`}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 top-4 text-slate-500 transition-all duration-300 pointer-events-none 
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                           peer-focus:-top-0.5 peer-focus:text-xs peer-focus:text-blue-600
                           ${value ? '-top-0.5 text-xs' : ''}`}
            >
                {label}
            </label>
            <AnimatePresence>
              {error && <motion.p initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="mt-1 text-xs text-red-600">{error}</motion.p>}
            </AnimatePresence>
        </div>
    );
};

export default ContactPage;