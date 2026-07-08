import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Phone, Mail, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const BG_WARM = '#FAF7F1';
const BORDER = '#E5DDCD';
const TEXT_MUTED = 'rgba(10,22,40,0.72)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const sans = { fontFamily: "'Manrope', sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

/**
 * Stripe redirects buyers here after the Supervisor Kit checkout.
 * We poll /api/supervisor-kit/verify which (a) confirms payment status,
 * (b) sends the Resend confirmation email + Vince notification on first call,
 * and (c) tags the buyer in MailerLite.
 */
const SupervisorKitThankYouPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [state, setState] = useState({ loading: true, verified: false, variant: null });

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, verified: false, variant: null });
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(`${API}/api/supervisor-kit/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.verified) {
          setState({ loading: false, verified: true, variant: data.variant });
          return;
        }
        if (attempts < 6) {
          setTimeout(poll, 1500);
        } else {
          setState({ loading: false, verified: false, variant: null });
        }
      } catch {
        if (attempts < 6) {
          setTimeout(poll, 1500);
        } else {
          setState({ loading: false, verified: false, variant: null });
        }
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const isPhysical = state.variant === 'physical';

  return (
    <main
      data-testid="kit-thankyou-page"
      style={{ backgroundColor: BG_WARM, color: NAVY, minHeight: '70vh' }}
    >
      <SEO
        title="Order Confirmed | GigLine Supervisor Safety OS"
        description="Your GigLine Supervisor Safety OS order is confirmed."
        canonical="/supervisor-kit/thank-you"
        noindex
      />

      <section className="px-5 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          {state.loading && (
            <p
              className="uppercase font-bold tracking-[0.28em]"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
              data-testid="kit-thankyou-verifying"
            >
              Verifying your payment&hellip;
            </p>
          )}

          {!state.loading && state.verified && (
            <>
              <CheckCircle2
                size={56}
                strokeWidth={2}
                style={{ color: GOLD, margin: '0 auto 18px' }}
                data-testid="kit-thankyou-check"
              />              <p
                className="uppercase font-bold tracking-[0.28em] mb-4"
                style={{ color: GOLD, ...mono, fontSize: '11px' }}
              >
                Order Confirmed
              </p>
              <h1
                className="font-bold leading-tight tracking-tight mb-5 text-[30px] md:text-[40px]"
                style={{ ...sans, color: NAVY }}
                data-testid="kit-thankyou-headline"
              >
                Thank you. Your order is confirmed.
              </h1>
              {isPhysical ? (
                <p
                  className="text-[17px] md:text-[18px] leading-[1.7] mb-3"
                  style={{ color: TEXT_MUTED, ...serif }}
                  data-testid="kit-thankyou-body-physical"
                >
                  Your kit will ship USPS Priority within 3 business days to the address you provided.
                  You&rsquo;ll also receive a separate email from Vince with a few notes on getting started.
                </p>
              ) : (
                <p
                  className="text-[17px] md:text-[18px] leading-[1.7] mb-3"
                  style={{ color: TEXT_MUTED, ...serif }}
                  data-testid="kit-thankyou-body-digital"
                >
                  All 17 documents are attached to the receipt email we just sent you.
                  Start with <strong>SS-01_Welcome.pdf</strong> &mdash; it explains how the system fits together.
                  If you don&rsquo;t see the email within a few minutes, check spam or call <strong>(336) 329-8899</strong>.
                </p>
              )}
              <p
                className="text-[15px] mt-3 mb-7"
                style={{ color: TEXT_MUTED, ...serif }}
              >
                A confirmation receipt is on its way to your email.
              </p>

              {/* Soft Google review prompt at the highest-intent moment */}
              <div
                className="mt-2 mb-9 mx-auto py-4 px-5 rounded-md inline-block"
                style={{ background: '#F3ECDB', border: `1px solid ${BORDER}`, maxWidth: '480px' }}
                data-testid="kit-thankyou-review-prompt"
              >
                <p className="text-[14.5px] leading-[1.55]" style={{ color: TEXT_MUTED, ...serif }}>
                  While you&rsquo;re here &mdash; if this saved you time, a short Google review keeps GigLine going for the next small operation.{' '}
                  <a
                    href="https://g.page/r/CdlAYUu_I3xpEAI/review?utm_source=kit-thank-you&utm_medium=app&utm_campaign=review-request"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:underline whitespace-nowrap"
                    style={{ color: GOLD }}
                    data-testid="kit-thankyou-review-link"
                  >
                    Leave a review &rarr;
                  </a>
                </p>
              </div>
            </>
          )}

          {!state.loading && !state.verified && (
            <>
              <p
                className="uppercase font-bold tracking-[0.28em] mb-4"
                style={{ color: '#8B2500', ...mono, fontSize: '11px' }}
                data-testid="kit-thankyou-pending"
              >
                We couldn&rsquo;t verify the payment yet
              </p>
              <h1
                className="font-bold leading-tight tracking-tight mb-5 text-[28px] md:text-[36px]"
                style={{ ...sans, color: NAVY }}
              >
                Hang tight &mdash; or give Vince a call.
              </h1>
              <p
                className="text-[16.5px] md:text-[17.5px] leading-[1.65] mb-8"
                style={{ color: TEXT_MUTED, ...serif }}
              >
                Stripe is finishing up the charge. If you got an email receipt, you&rsquo;re good
                &mdash; Vince will be in touch. If something looks off, call{' '}
                <strong>(336) 329-8899</strong>.
              </p>
            </>
          )}

          {/* Contact pad */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch mt-2"
            data-testid="kit-thankyou-contact"
          >
            <a
              href="tel:+13363298899"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 transition-all text-[15px]"
              style={{ background: NAVY, color: 'white', ...sans }}
              data-testid="kit-thankyou-phone"
            >
              <Phone size={16} />
              (336) 329-8899
            </a>
            <a
              href="mailto:vince@giglinecompliance.com?subject=Supervisor%20Safety%20Starter%20System"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 transition-all text-[15px] border-2"
              style={{ borderColor: NAVY, color: NAVY, ...sans }}
              data-testid="kit-thankyou-email"
            >
              <Mail size={16} />
              Email Vince
            </a>
          </div>

          <div className="mt-10" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '24px' }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm hover:opacity-70"
              style={{ color: TEXT_MUTED }}
              data-testid="kit-thankyou-home"
            >
              <ArrowLeft size={14} /> Back to GigLine
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SupervisorKitThankYouPage;
