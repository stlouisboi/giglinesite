import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileStickyFooter from './components/MobileStickyFooter';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import SafetyCheckPage from './pages/SafetyCheckPage';
import NotFoundPage from './pages/NotFoundPage';
import HazComPage from './pages/HazComPage';
import HazComThankYouPage from './pages/HazComThankYouPage';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/safety-check" element={<SafetyCheckPage />} />
              <Route path="/hazcom" element={<HazComPage />} />
              <Route path="/hazcom/thank-you" element={<HazComThankYouPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
          <MobileStickyFooter />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
