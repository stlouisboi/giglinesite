import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import SEO from '../components/SEO';

/*
  GL-WEB-014 — Terms of Service
  Plain-language B2B service-agreement framework.
  Covers acceptable use, SMS terms, IP, payment, warranties, liability,
  governing law (NC), termination, and modifications.
*/

const TermsOfServicePage = () => {
  const NAVY = '#0A1628';
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>
      <SEO
        title="Terms of Service | GigLine Safety & Compliance"
        description="The terms governing your use of giglinecompliance.com and the services provided by GigLine Safety & Compliance."
        canonical="/terms-of-service"
      />

      <header style={{ backgroundColor: NAVY }} className="py-12 md:py-16">
        <div className="container max-w-3xl mx-auto px-5 md:px-8">
          <p
            className="uppercase font-bold tracking-[3px] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C5A059' }}
            data-testid="terms-kicker"
          >
            GL-TERMS-001 &middot; Last Updated June 2026
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight text-white"
            style={{ fontFamily: "'Manrope', sans-serif" }}
            data-testid="terms-heading"
          >
            Terms of Service
          </h1>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20 space-y-12" data-testid="terms-content">

        <section>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(11,31,51,0.78)' }}>
            These Terms govern your use of <strong>giglinecompliance.com</strong> and the services provided by GigLine Safety &amp; Compliance, operated by Vince Lawrence in Kernersville, North Carolina (&ldquo;GigLine,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
          </p>
          <p className="text-base md:text-lg leading-relaxed mt-4" style={{ color: 'rgba(11,31,51,0.78)' }}>
            By using this website or engaging GigLine for any service, you agree to these Terms. If you don&rsquo;t agree, don&rsquo;t use the site or engage the services.
          </p>
        </section>

        <Section title="1. Services">
          <p>
            GigLine provides safety consulting services including on-site walkthroughs, documentation reviews, incident reviews, and the creation of written safety programs. Services are provided on a project basis under a written scope of work confirmed by both parties before work begins.
          </p>
          <p className="mt-3">
            Nothing on this website creates a consulting engagement or binding contract. An engagement begins only when a written scope and fee have been confirmed in writing (email is sufficient) by both you and GigLine.
          </p>
        </Section>

        <Section title="2. Use of the Website">
          <p>
            You agree to use the site lawfully. You will not:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>Submit false information through any form on this site</li>
            <li>Use the site to harass, defame, or harm another party</li>
            <li>Attempt to gain unauthorized access to GigLine systems, servers, or accounts</li>
            <li>Scrape, copy, or republish substantial portions of GigLine&rsquo;s content for commercial purposes without written permission</li>
            <li>Upload malware, viruses, or anything that could damage GigLine systems</li>
          </ul>
        </Section>

        <Section title="3. Intellectual Property">
          <p>
            All content on this website &mdash; including written text, photographs, the GigLine logo, the GigLine Safety Walkthrough Report format, the Triad OSHA Field Manual, the case study, lead-magnet PDFs, and all derivative materials &mdash; is the intellectual property of GigLine Safety &amp; Compliance.
          </p>
          <p className="mt-3">
            When you engage GigLine for a service, you receive a license to use the deliverables (reports, programs, training materials) within your operation. You may not resell, redistribute, or sublicense GigLine deliverables to third parties without written permission.
          </p>
        </Section>

        <Section title="4. Payment Terms">
          <p>
            Service fees are confirmed in writing before work begins. Standard terms:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>Fees are quoted in U.S. dollars</li>
            <li>Payment is due within 15 days of invoice unless otherwise agreed in writing</li>
            <li>Stripe is the standard payment processor; ACH and check are accepted by arrangement</li>
            <li>Late payments may incur a 1.5% monthly service charge</li>
            <li>Digital deliverables (PDFs, downloadable resources purchased through Stripe) are delivered immediately upon payment and are non-refundable once accessed</li>
          </ul>
        </Section>

        <Section title="5. Service Warranties &amp; Disclaimers">
          <p>
            GigLine provides safety consulting based on 25+ years of operational experience and OSHA 30-Hour General Industry certification. Recommendations reflect prevailing OSHA standards as of the engagement date.
          </p>
          <p className="mt-3">
            <strong>GigLine does not guarantee that following any recommendation will prevent OSHA citations, workplace injuries, insurance claims, or any other outcome.</strong> Safety is the ongoing responsibility of the operator. GigLine&rsquo;s deliverables are advisory and do not constitute legal advice.
          </p>
          <p className="mt-3">
            The website and all content are provided &ldquo;as is&rdquo; without warranty of any kind. Information on the site is for general educational purposes and may not reflect the most current OSHA standards.
          </p>
        </Section>

        <Section title="6. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, GigLine&rsquo;s total liability for any claim arising from these Terms, the website, or any service engagement is limited to the fees paid by you to GigLine for the specific engagement giving rise to the claim during the 12 months preceding the claim.
          </p>
          <p className="mt-3">
            GigLine is not liable for indirect, consequential, incidental, or punitive damages, including lost profits, lost business opportunities, or third-party claims.
          </p>
        </Section>

        <Section title="7. Indemnification">
          <p>
            You agree to indemnify and hold harmless GigLine, Vince Lawrence personally, and any GigLine subprocessors against any claims, damages, or expenses arising from your misuse of the website, breach of these Terms, or violation of any third-party rights.
          </p>
        </Section>

        <Section title="8. Acceptable Use">
          <p>
            By using this website and any of GigLine&rsquo;s services, you agree to act in good faith. Specifically:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>You will provide accurate information on intake forms</li>
            <li>You will not represent GigLine deliverables as your own original work or as approved by OSHA</li>
            <li>You will not use GigLine reports to mislead regulators, insurers, or third parties</li>
            <li>You acknowledge that the report Vince delivers reflects what was visible on the day of the walkthrough &mdash; not a guarantee of ongoing compliance</li>
          </ul>
        </Section>

        <Section title="9. SMS Terms">
          <p>
            By providing your mobile phone number and opting in to receive text messages, you agree to receive SMS communications from GigLine Safety &amp; Compliance and LaunchPath Transportation EDU LLC related to the following:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-3">
            <li>Appointment confirmations and scheduling reminders</li>
            <li>Proposal and document status notifications</li>
            <li>Service enrollment confirmations and access notifications</li>
            <li>Schedule and milestone updates</li>
            <li>Responses to inquiries and follow-up communications</li>
            <li>Promotional messages about services and availability</li>
          </ul>
          <p className="mt-4"><strong>Messaging frequency may vary.</strong></p>
          <p className="mt-2"><strong>Message and data rates may apply.</strong></p>
          <p className="mt-2"><strong>To opt out at any time, reply STOP.</strong> You will receive one confirmation and no further messages.</p>
          <p className="mt-2"><strong>For assistance, reply HELP or call <a href="tel:3363298899" className="font-bold underline" style={{ color: '#2A52A0' }}>(336) 329-8899</a>.</strong></p>
          <p className="mt-4">
            For our full privacy practices, see our{' '}
            <Link to="/privacy-policy" className="font-bold underline" style={{ color: '#2A52A0' }}>Privacy Policy</Link>.
          </p>
        </Section>

        <Section title="10. Modifications to Terms">
          <p>
            GigLine may revise these Terms at any time. Material changes will be reflected in the &ldquo;Last Updated&rdquo; date at the top. Continued use of the site or services after a revision constitutes acceptance of the updated Terms.
          </p>
          <p className="mt-3">
            For active engagements, the Terms in effect on the date your scope was confirmed in writing apply for the duration of that engagement.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            Either party may terminate an engagement in writing with reasonable notice. Fees for work performed up to the termination date remain due. Digital deliverables already provided remain with you under the license described in Section 3.
          </p>
          <p className="mt-3">
            GigLine reserves the right to refuse service or end an engagement if a client materially breaches these Terms or behaves in a way that compromises Vince&rsquo;s ability to provide professional consulting (e.g. dishonesty in intake, harassment, requests to misrepresent findings to regulators).
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms are governed by the laws of the State of North Carolina, without regard to conflict-of-law principles. Any dispute arising from these Terms or any GigLine engagement will be resolved in the state or federal courts located in Forsyth County, North Carolina.
          </p>
        </Section>

        <Section title="13. Contact">
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
            data-testid="terms-back-home"
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

export default TermsOfServicePage;
