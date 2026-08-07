import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { trackPageView, initAttribution } from './utils/analytics';
import ScrollToTop from './components/ScrollToTop';
import { SUPERVISOR_KIT_ENABLED } from './config/features';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileStickyFooter from './components/MobileStickyFooter';

// Eager: renders instantly on every landing — the LCP path
import HomePage from './pages/HomePage';

// Lazy: 43 secondary pages split into per-route chunks.
// Users who never visit /admin or /faq never download those bundles.
const ServicesPage                    = lazy(() => import('./pages/ServicesPage'));
const AboutPage                       = lazy(() => import('./pages/AboutPage'));
const ContactPage                     = lazy(() => import('./pages/ContactPage'));
const PaymentSuccessPage              = lazy(() => import('./pages/PaymentSuccessPage'));
const SafetyCheckPage                 = lazy(() => import('./pages/SafetyCheckPage'));
const NotFoundPage                    = lazy(() => import('./pages/NotFoundPage'));
const HazComPage                      = lazy(() => import('./pages/HazComPage'));
const HazComThankYouPage              = lazy(() => import('./pages/HazComThankYouPage'));
const BlogOSHAViolations              = lazy(() => import('./pages/BlogOSHAViolations'));
const BlogHazComRequirements          = lazy(() => import('./pages/BlogHazComRequirements'));
const HeatGuidePage                   = lazy(() => import('./pages/HeatGuidePage'));
const SampleReportPage                = lazy(() => import('./pages/SampleReportPage'));
const ResourcesPage                   = lazy(() => import('./pages/ResourcesPage'));
const OshaInspectionGuidePage         = lazy(() => import('./pages/OshaInspectionGuidePage'));
const OshaComplianceGuidePage         = lazy(() => import('./pages/OshaComplianceGuidePage'));
const ForkliftComplianceReviewNCPage  = lazy(() => import('./pages/ForkliftComplianceReviewNCPage'));
const LOTOProcedureReviewNCPage       = lazy(() => import('./pages/LOTOProcedureReviewNCPage'));
const OSHADocumentationReviewNCPage   = lazy(() => import('./pages/OSHADocumentationReviewNCPage'));
const ClientIntakePage                = lazy(() => import('./pages/ClientIntakePage'));
const StatusPage                      = lazy(() => import('./pages/StatusPage'));
const ReportPage                      = lazy(() => import('./pages/ReportPage'));
const AdminPage                       = lazy(() => import('./pages/AdminPage'));
const FieldNotesPage                  = lazy(() => import('./pages/FieldNotesPage'));
const FieldNoteDetailPage             = lazy(() => import('./pages/FieldNoteDetailPage'));
const CityLandingPage                 = lazy(() => import('./pages/CityLandingPage'));
const FAQPage                         = lazy(() => import('./pages/FAQPage'));
const ServiceDetailPage               = lazy(() => import('./pages/ServiceDetailPage'));
const DocumentDevelopmentPage         = lazy(() => import('./pages/DocumentDevelopmentPage'));
const AnnualCompliancePartnerPage     = lazy(() => import('./pages/AnnualCompliancePartnerPage'));
const ComplianceReadinessVisitPage    = lazy(() => import('./pages/ComplianceReadinessVisitPage'));
const ServiceAreasPage                = lazy(() => import('./pages/ServiceAreasPage'));
const WalkthroughLandingPage          = lazy(() => import('./pages/WalkthroughLandingPage'));
const CaseStudyMetalsFabricationPage  = lazy(() => import('./pages/CaseStudyMetalsFabricationPage'));
const SupervisorKitPage               = lazy(() => import('./pages/SupervisorKitPage'));
const SupervisorKitThankYouPage       = lazy(() => import('./pages/SupervisorKitThankYouPage'));
const ThankYouIntakePage              = lazy(() => import('./pages/ThankYouIntakePage'));
const PrivacyPolicyPage               = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage              = lazy(() => import('./pages/TermsOfServicePage'));
const SafetyWalkthroughPage           = lazy(() => import('./pages/SafetyWalkthroughPage'));
const IncidentReviewPage              = lazy(() => import('./pages/IncidentReviewPage'));
const OshaReadyControlSystemPage      = lazy(() => import('./pages/OshaReadyControlSystemPage'));
const CorrectiveActionImplementationPage = lazy(() => import('./pages/CorrectiveActionImplementationPage'));
const DocumentationGapCheckPage       = lazy(() => import('./pages/DocumentationGapCheckPage'));
const OshaComplianceGapCheckPage      = lazy(() => import('./pages/OshaComplianceGapCheckPage'));

// Content marketing / pillar blog posts (Nov 2025 launch batch)
const BlogHubPage                     = lazy(() => import('./pages/BlogHubPage'));
const BlogMachineGuardingChecklist    = lazy(() => import('./pages/BlogMachineGuardingChecklist'));
const BlogLOTOProgram                 = lazy(() => import('./pages/BlogLOTOProgram'));
const BlogForkliftCompliance          = lazy(() => import('./pages/BlogForkliftCompliance'));
const BlogHazComPreInspection         = lazy(() => import('./pages/BlogHazComPreInspection'));
const BlogOSHA300LogMistakes          = lazy(() => import('./pages/BlogOSHA300LogMistakes'));
const BlogMidYear2026OshaUpdate       = lazy(() => import('./pages/BlogMidYear2026OshaUpdate'));
const BlogOSHAPenaltyNC2026           = lazy(() => import('./pages/BlogOSHAPenaltyNC2026'));

// Citation-Proof Kit Series
const CitationProofKitsPage           = lazy(() => import('./pages/CitationProofKitsPage'));
const CitationProofKitDetailPage      = lazy(() => import('./pages/CitationProofKitDetailPage'));
const CitationProofKitThankYouPage    = lazy(() => import('./pages/CitationProofKitThankYouPage'));

// Kit delivery recovery (self-serve resend for spam-blocked emails)
const ResendMyKitPage                 = lazy(() => import('./pages/ResendMyKitPage'));

// Citation Cost Calculator — free interactive lead-magnet
const CitationCostCalculatorPage      = lazy(() => import('./pages/CitationCostCalculatorPage'));

import './App.css';

// Minimal skeleton shown while a lazy chunk loads. Kept small so it never
// steals the LCP slot on the homepage (which is eager and doesn't hit this).
function PageFallback() {
  return (
    <div
      className="flex items-center justify-center py-24"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      data-testid="page-loading-fallback"
    >
      <div className="h-8 w-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
    </div>
  );
}

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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Standalone portal pages — own nav, no global Navbar/Footer */}
            <Route path="/walkthrough" element={<WalkthroughLandingPage />} />
            <Route path="/intake" element={<ClientIntakePage />} />
            {/* /onboarding portal retired (legacy pricing). Forward old links to /intake. */}
            <Route path="/onboarding" element={<Navigate to="/intake" replace />} />
            <Route path="/onboarding/confirmed" element={<Navigate to="/intake" replace />} />
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
                    <Route path="/services/compliance-readiness-visit" element={<ComplianceReadinessVisitPage />} />
                    {/* 301-equivalent: legacy /services/safety-walkthrough URLs consolidated to /safety-walkthrough */}
                    <Route path="/services/safety-walkthrough" element={<Navigate to="/safety-walkthrough" replace />} />
                    <Route path="/services/safety-walkthrough-report" element={<Navigate to="/safety-walkthrough" replace />} />
                    <Route path="/services/incident-review" element={<IncidentReviewPage />} />
                    <Route path="/services/osha-ready-control-system" element={<OshaReadyControlSystemPage />} />
                    <Route path="/services/corrective-action-implementation" element={<CorrectiveActionImplementationPage />} />
                    <Route path="/services/:slug" element={<ServiceDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/payment-success" element={<PaymentSuccessPage />} />
                    <Route path="/safety-check" element={<SafetyCheckPage />} />
                    <Route path="/hazcom" element={<Navigate to="/hazcom-starter-pack" replace />} />
                    <Route path="/hazcom-starter-pack" element={<HazComPage />} />
                    <Route path="/hazcom/thank-you" element={<HazComThankYouPage />} />
                    <Route path="/hazcom-starter-pack/thank-you" element={<Navigate to="/hazcom/thank-you" replace />} />
                    <Route path="/blog" element={<BlogHubPage />} />
                    <Route path="/blog/top-5-osha-violations-small-manufacturing" element={<BlogOSHAViolations />} />
                    <Route path="/blog/hazcom-requirements-small-business" element={<BlogHazComRequirements />} />
                    <Route path="/blog/osha-machine-guarding-checklist-small-manufacturers" element={<BlogMachineGuardingChecklist />} />
                    <Route path="/blog/loto-program-requirements-small-facilities" element={<BlogLOTOProgram />} />
                    <Route path="/blog/osha-forklift-compliance-inspector-checklist" element={<BlogForkliftCompliance />} />
                    <Route path="/blog/written-hazcom-program-before-osha-inspection" element={<BlogHazComPreInspection />} />
                    <Route path="/blog/osha-300-log-common-mistakes-citations" element={<BlogOSHA300LogMistakes />} />
                    <Route path="/blog/mid-year-2026-osha-update-nc-manufacturers" element={<BlogMidYear2026OshaUpdate />} />
                    <Route path="/blog/osha-penalty-north-carolina-2026" element={<BlogOSHAPenaltyNC2026 />} />
                    <Route path="/heat-guide" element={<HeatGuidePage />} />
                    <Route path="/sample-report" element={<SampleReportPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/osha-inspection-guide" element={<OshaInspectionGuidePage />} />
                    <Route path="/osha-compliance-guide" element={<OshaComplianceGuidePage />} />
                    <Route path="/forklift-compliance-review-nc" element={<ForkliftComplianceReviewNCPage />} />
                    <Route path="/loto-procedure-review-nc" element={<LOTOProcedureReviewNCPage />} />
                    <Route path="/osha-documentation-review-nc" element={<OSHADocumentationReviewNCPage />} />
                    <Route path="/request-walkthrough" element={<Navigate to="/intake" replace />} />
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
                    <Route path="/case-study/metals-fabrication-statesville" element={<CaseStudyMetalsFabricationPage />} />
                    <Route path="/case-studies/mocksville-plastics-osha-inspection" element={<Navigate to="/case-study/metals-fabrication-statesville" replace />} />
                    {/* Citation-Proof Kit Series */}
                    <Route path="/citation-proof-kits" element={<CitationProofKitsPage />} />
                    <Route path="/citation-proof-kits/:slug/thank-you" element={<CitationProofKitThankYouPage />} />
                    <Route path="/citation-proof-kits/:slug" element={<CitationProofKitDetailPage />} />
                    <Route path="/kits" element={<Navigate to="/citation-proof-kits" replace />} />
                    <Route path="/kits/*" element={<Navigate to="/citation-proof-kits" replace />} />
                    {SUPERVISOR_KIT_ENABLED ? (
                      <>
                        <Route path="/supervisor-kit" element={<SupervisorKitPage />} />
                        <Route path="/supervisor-kit/thank-you" element={<SupervisorKitThankYouPage />} />
                      </>
                    ) : (
                      <>
                        <Route path="/supervisor-kit" element={<Navigate to="/services" replace />} />
                        <Route path="/supervisor-kit/thank-you" element={<Navigate to="/services" replace />} />
                      </>
                    )}
                    <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/resend-my-kit" element={<ResendMyKitPage />} />
                    <Route path="/citation-cost-calculator" element={<CitationCostCalculatorPage />} />
                    <Route path="/osha-citation-calculator" element={<Navigate to="/citation-cost-calculator" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
                <Footer />
                <MobileStickyFooter />
              </div>
            } />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
