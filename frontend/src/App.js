import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { trackPageView } from './utils/analytics';
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
import BlogOSHAViolations from './pages/BlogOSHAViolations';
import BlogHazComRequirements from './pages/BlogHazComRequirements';
import HeatGuidePage from './pages/HeatGuidePage';
import IntakePage from './pages/IntakePage';
import AdminPage from './pages/AdminPage';
import FieldNotesPage from './pages/FieldNotesPage';
import FieldNoteDetailPage from './pages/FieldNoteDetailPage';
import CityLandingPage from './pages/CityLandingPage';
import './App.css';

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <RouteTracker />
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
              <Route path="/blog/top-5-osha-violations-small-manufacturing" element={<BlogOSHAViolations />} />
              <Route path="/blog/hazcom-requirements-small-business" element={<BlogHazComRequirements />} />
              <Route path="/heat-guide" element={<HeatGuidePage />} />
              <Route path="/request-walkthrough" element={<IntakePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/field-notes" element={<FieldNotesPage />} />
              <Route path="/field-notes/:slug" element={<FieldNoteDetailPage />} />
              <Route path="/safety-walkthrough/:city" element={<CityLandingPage />} />
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
