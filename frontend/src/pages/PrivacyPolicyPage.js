import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import SEO from '../components/SEO';

/*
  GL-WEB-PRIVACY-001 — Privacy Policy
  Plain-language single-page disclosure.
  Covers intake form data, MailerLite email use, subprocessors, user rights.
*/

const PrivacyPolicyPage = () => {
  const NAVY = '#0A1628';
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>
      <SEO
        title="Privacy Policy | GigLine Safety & Compliance"
        description="How GigLine Safety & Compliance collects, uses, and protects your information."
        canonical="/privacy"
      />

      <header style={{ backgroundColor: NAVY }} className="py-12 md:py-16">
        <div className="container max-w-3xl mx-auto px-5 md:px-8">
          <p
            className="uppercase font-bold tracking-[3px] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C5A059' }}
            data-testid="privacy-kicker"
          >
            GL-PRIVACY-001 &middot; Last Updated June 2026
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight text-white"
            style={{ fontFamily: "'Manrope', sans-serif" }}
            data-testid="privacy-heading"
          >
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20 space-y-12" data-testid="privacy-content">

        <section>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(11,31,51,0.78)' }}>
            GigLine Safety &amp; Compliance is a one-person operation run by Vince Lawrence in Kernersville, North Carolina. This policy explains, in plain language, what information GigLine collects when you use this website, how it&rsquo;s used, and who has access to it.
          </p>
          <p className="text-base md:text-lg leading-relaxed mt-4" style={{ color: 'rgba(11,31,51,0.78)' }}>
            Short version: information you submit goes to Vince. It is used to follow up on your inquiry, scope your engagement, and stay in touch with you until you ask us to stop. <strong>It is never sold, never shared with OSHA, never shared with your insurer, and never shared with any other third party for marketing purposes.</strong>
          </p>
        </section>

        <Section title="1. What we collect">
          <p>When you submit a form on this site (intake form, walkthrough request, newsletter signup, downloadable resource), you may provide:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>Your name, company name, job title, phone number, and email address</li>
            <li>Facility address, employee count, and operation type</li>
            <li>Details about your safety programs, recent incidents, and what prompted you to reach out</li>
            <li>Uploaded documents (if you attach safety programs or records during intake)</li>
            <li>Marketing attribution data (which page referred you, UTM parameters from ads)</li>
          </ul>
        </Section>

        <Section title="2. How we use it">
          <p>The information you submit is used to:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>Contact you about your safety request and confirm a quote</li>
            <li>Deliver agreed-upon services (walkthroughs, documentation reviews, incident response)</li>
            <li>Send periodic emails relevant to your industry &mdash; Field Notes, OSHA updates, the annual Triad Field Manual</li>
            <li>Improve the GigLine website by reviewing aggregated traffic patterns (page views, form completions)</li>
          </ul>
          <p className="mt-3">
            You can unsubscribe from any GigLine email at any time using the unsubscribe link in the footer of every email. Your data remains in the system for record-keeping but you will not receive further marketing emails.
          </p>
        </Section>

        <Section title="3. Subprocessors">
          <p>To run the GigLine website and operations, the following third-party services have access to portions of your data:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li><strong>Resend</strong> &mdash; transactional email delivery (confirmation emails, scope quotes, report delivery notifications)</li>
            <li><strong>MailerLite</strong> &mdash; email marketing and automation</li>
            <li><strong>MailerSend</strong> &mdash; transactional email delivery</li>
            <li><strong>RingCentral</strong> &mdash; SMS and voice communications. Your phone number may be used to send SMS messages per your opt-in consent. Governed by{' '}
              <a href="https://www.ringcentral.com/legal/privacy-notice.html" target="_blank" rel="noopener noreferrer" className="font-bold underline" style={{ color: '#2A52A0' }}>
                RingCentral&rsquo;s Privacy Policy
              </a>.
            </li>
            <li><strong>MongoDB Atlas</strong> &mdash; database storage for intake submissions and engagement records</li>
            <li><strong>Vercel</strong> &mdash; website hosting and static asset delivery</li>
            <li><strong>Railway</strong> &mdash; backend API hosting</li>
            <li><strong>Stripe</strong> &mdash; payment processing (only if you purchase a downloadable document or service)</li>
          </ul>
          <p className="mt-3">
            Each of these subprocessors has its own privacy and security policy. GigLine selects vendors with reputable security postures (SOC 2 / ISO 27001 where applicable) and the principle of least access.
          </p>
        </Section>

        <Section title="4. What we don&rsquo;t do">
          <p>For absolute clarity:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>We <strong>do not</strong> sell, rent, or trade your personal information.</li>
            <li>We <strong>do not</strong> share your intake form responses with OSHA. Submissions to GigLine are not OSHA disclosures.</li>
            <li>We <strong>do not</strong> share your information with your insurance carrier without your explicit written request.</li>
            <li>We <strong>do not</strong> place advertising tracking pixels (Facebook Pixel, Google Ads conversion tags) on the site at this time.</li>
          </ul>
        </Section>

        <Section title="5. Cookies and analytics">
          <p>
            This site uses minimal first-party cookies to remember your preferences and a privacy-respecting analytics implementation to count page views. We do not use Google Analytics or any third-party advertising network on this site.
          </p>
        </Section>

        <Section title="6. SMS Communications">
          <p>
            We use SMS (text messaging) to communicate with clients and program participants regarding appointment confirmations, service updates, program enrollment notifications, and general business communications for both GigLine Safety &amp; Compliance and LaunchPath Transportation EDU LLC.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li><strong>Opt-in:</strong> By providing your mobile phone number through any form on our websites, you consent to receive SMS messages from us.</li>
            <li><strong>SMS consent is not shared with third parties or affiliates for any purpose.</strong></li>
            <li><strong>Opt-out:</strong> Reply <strong>STOP</strong> at any time to unsubscribe. You will receive one confirmation message and no further SMS messages will be sent.</li>
            <li><strong>Help:</strong> Reply <strong>HELP</strong> or call <a href="tel:3363298899" className="font-bold underline" style={{ color: '#2A52A0' }}>(336) 329-8899</a>.</li>
            <li><strong>Message and data rates may apply.</strong> Messaging frequency varies.</li>
          </ul>
        </Section>

        <Section title="7. Children">
          <p>
            GigLine&rsquo;s services are for industrial and commercial operators and are not directed at individuals under 18. We do not knowingly collect information from anyone under 18.
          </p>
        </Section>

        <Section title="8. Your rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>Request a copy of all information GigLine holds about you</li>
            <li>Request correction of any inaccurate information</li>
            <li>Request deletion of your information (with the exception of records required to be retained for legal or tax purposes)</li>
            <li>Unsubscribe from marketing emails at any time</li>
            <li>Opt out of SMS communications by replying <strong>STOP</strong></li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email Vince directly at{' '}
            <a href="mailto:vince@giglinecompliance.com" className="font-bold underline" style={{ color: '#2A52A0' }}>
              vince@giglinecompliance.com
            </a>{' '}
            with the subject line &ldquo;Privacy Request.&rdquo; Responses within 5 business days.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            If this policy changes meaningfully, the &ldquo;Last Updated&rdquo; date at the top will be revised and active clients will be notified by email.
          </p>
        </Section>

        <Section title="10. Contact">
          <div
            className="rounded-lg p-6 mt-3"
            style={{ background: 'white', border: '1px solid rgba(11,31,51,0.10)' }}
          >
            <p className="font-bold mb-3" style={{ color: NAVY }}>Vince Lawrence</p>
            <p style={{ color: 'rgba(11,31,51,0.78)' }}>GigLine Safety &amp; Compliance</p>
            <p className="mt-3 flex items-center gap-2" style={{ color: 'rgba(11,31,51,0.78)' }}>
              <Phone size={14} style={{ color: '#2A52A0' }} />
              <a href="tel:3363298899" className="hover:underline">(336) 329-8899</a>
            </p>
            <p className="mt-1.5 flex items-center gap-2" style={{ color: 'rgba(11,31,51,0.78)' }}>
              <Mail size={14} style={{ color: '#2A52A0' }} />
              <a href="mailto:vince@giglinecompliance.com" className="hover:underline">vince@giglinecompliance.com</a>
            </p>
          </div>
        </Section>

        <div className="pt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
            style={{ color: '#2A52A0' }}
            data-testid="privacy-back-home"
          >
            Back to GigLine
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section>
    <h2
      className="text-xl md:text-2xl font-bold leading-tight mb-3"
      style={{ fontFamily: "'Manrope', sans-serif", color: '#0A1628' }}
    >
      {title}
    </h2>
    <div className="text-base leading-relaxed space-y-2" style={{ color: 'rgba(11,31,51,0.75)' }}>
      {children}
    </div>
  </section>
);

export default PrivacyPolicyPage;
