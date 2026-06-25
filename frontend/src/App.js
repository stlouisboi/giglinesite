import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { trackPageView, initAttribution } from './utils/analytics';
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
import ClientIntakePage from './pages/ClientIntakePage';
import OnboardingPage from './pages/OnboardingPage';
import StatusPage from './pages/StatusPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import FieldNotesPage from './pages/FieldNotesPage';
import FieldNoteDetailPage from './pages/FieldNoteDetailPage';
import CityLandingPage from './pages/CityLandingPage';
import FAQPage from './pages/FAQPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import DocumentDevelopmentPage from './pages/DocumentDevelopmentPage';
import AnnualCompliancePartnerPage from './pages/AnnualCompliancePartnerPage';
import ServiceAreasPage from './pages/ServiceAreasPage';
import WalkthroughLandingPage from './pages/WalkthroughLandingPage';
import CaseStudyMocksvillePage from './pages/CaseStudyMocksvillePage';
import ThankYouIntakePage from './pages/ThankYouIntakePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SafetyWalkthroughPage from './pages/SafetyWalkthroughPage';
import DocumentationGapCheckPage from './pages/DocumentationGapCheckPage';
import OshaComplianceGapCheckPage from './pages/OshaComplianceGapCheckPage';
import './App.css';

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);
  return null;
}

function App() {
  useEffect(() => {
    initAttribution();
  }, []);
  return (
    <HelmetProvider>
      <Router>
        <RouteTracker />
        <ScrollToTop />
        <Routes>
          {/* Standalone portal pages — own nav, no global Navbar/Footer */}
          <Route path="/walkthrough" element={<WalkthroughLandingPage />} />
          <Route path="/intake" element={<ClientIntakePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/onboarding/confirmed" element={<OnboardingPage />} />
          <Route path="/status/:clientToken" element={<StatusPage />} />
          <Route path="/report/:clientToken" element={<ReportPage />} />
          <Route path="/thank-you-intake" element={<ThankYouIntakePage />} />

          {/* Standard pages with global Navbar + Footer */}
          <Route path="*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow pb-20 md:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/document-development" element={<DocumentDevelopmentPage />} />
                  <Route path="/services/annual-compliance-partner" element={<AnnualCompliancePartnerPage />} />
                  <Route path="/services/:slug" element={<ServiceDetailPage />} />
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
                  {/* Buyer-intent service landing pages (Findability Framework) — must be defined
                      before the dynamic /safety-walkthrough/:city route below. */}
                  <Route path="/safety-walkthrough" element={<SafetyWalkthroughPage />} />
                  <Route path="/documentation-gap-check" element={<DocumentationGapCheckPage />} />
                  <Route path="/osha-compliance-gap-check" element={<OshaComplianceGapCheckPage />} />
                  <Route path="/safety-walkthrough/:city" element={<CityLandingPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/service-areas" element={<ServiceAreasPage />} />
                  <Route path="/case-studies/mocksville-plastics-osha-inspection" element={<CaseStudyMocksvillePage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              <Footer />
              <MobileStickyFooter />
            </div>
          } />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
