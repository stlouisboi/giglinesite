import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Phone, Mail, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { KIT_DETAILS } from '../data/citationProofKits';

const API = process.env.REACT_APP_BACKEND_URL;

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const BG_WARM = '#FAF7F1';
const PANEL = '#F3ECDB';
const BORDER = '#e8e5dd';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const sans = { fontFamily: "'Manrope', sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

/**
 * Stripe redirects the buyer here after a Citation-Proof Kit ($150 Digital) purchase.
 * The page polls /api/citation-proof-kit/verify which:
 *   1. Confirms payment_status = paid via Stripe
 *   2. Sends the buyer confirmation email (via Resend) on first paid verify call
 *   3. Sends Vince the ACTION REQUIRED notification so he manually fulfills the kit
 *
 * Fulfillment is deliberately MANUAL in v1 — the email tells the buyer the kit will
 * arrive in a separate email from Vince, typically within 1 business day.
 */
const CitationProofKitThankYouPage = () => {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const tierFromUrl = params.get('tier') || 'digital';
  const kit = KIT_DETAILS[slug];
  const kitName = kit?.name || 'GigLine Citation-Proof Kit';

  // `verifyData` fills in from the verify endpoint on success — it authoritatively
  // tells us the tier, tier_label, whether a physical binder ships, and the ship window.
  const [state, setState] = useState({ loading: true, verified: false, verifyData: null });

  const isBinderTier = state.verifyData?.physical_binder || tierFromUrl === 'binder';
  const tierLabel =
    state.verifyData?.tier_label ||
    (tierFromUrl === 'binder' ? 'Inspector-Ready Binder Edition' :
     tierFromUrl === 'control-system' ? 'Compliance Control System' :
     'Digital Compliance Kit');
  const shipWindow = state.verifyData?.ship_window || '3–5 business days';

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, verified: false, verifyData: null });
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `${API}/api/citation-proof-kit/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data.verified) {
          setState({ loading: false, verified: true, verifyData: data });
          return;
        }
        if (attempts < 6) {
          setTimeout(poll, 1500);
        } else {
          setState({ loading: false, verified: false, verifyData: null });
        }
      } catch {
        if (attempts < 6) {
          setTimeout(poll, 1500);
        } else {
          setState({ loading: false, verified: false, verifyData: null });
        }
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main
      data-testid="citation-proof-kit-thankyou-page"
      style={{ backgroundColor: BG_WARM, color: NAVY, minHeight: '70vh' }}
    >
      <SEO
        title={`Order Confirmed | ${kitName} | GigLine Safety & Compliance`}
        description={`Your ${kitName} Digital Compliance Kit order is confirmed.`}
        canonical={`/citation-proof-kits/${slug || ''}/thank-you`}
        noindex
      />

      <section className="px-5 md:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {state.loading && (
            <div
              className="rounded-md p-6 md:p-8 text-center"
              style={{ background: 'white', border: `1px solid ${BORDER}` }}
              data-testid="kit-thankyou-loading"
            >
              <Loader2 size={28} className="animate-spin mx-auto mb-3" style={{ color: GOLD }} />
              <p className="text-[15px]" style={{ color: 'rgba(10,22,40,0.7)', ...serif }}>
                Confirming your order with Stripe…
              </p>
            </div>
          )}

          {!state.loading && state.verified && (
            <div data-testid="kit-thankyou-success">
              <div className="mb-8 text-center">
                <div
                  className="inline-flex items-center justify-center rounded-full mb-4"
                  style={{ background: PANEL, width: 60, height: 60 }}
                >
                  <CheckCircle2 size={30} strokeWidth={2} style={{ color: GOLD }} />
                </div>
                <p
                  className="uppercase font-bold tracking-[0.28em] mb-3"
                  style={{ color: GOLD, ...mono, fontSize: '11px' }}
                >
                  Order Confirmed
                </p>
                <h1
                  className="text-[28px] md:text-[36px] font-extrabold leading-[1.15] mb-4"
                  style={{ color: NAVY, ...sans }}
                  data-testid="kit-thankyou-headline"
                >
                  Your order was received successfully.
                </h1>
                <p
                  className="text-[16px] md:text-[17.5px] leading-[1.65] max-w-xl mx-auto"
                  style={{ color: 'rgba(10,22,40,0.75)', ...serif }}
                >
                  Thanks for purchasing the <strong style={{ ...sans, color: NAVY }}>{kitName}</strong> — {tierLabel}.
                </p>
              </div>

              {isBinderTier ? (
                <div
                  className="rounded-md p-6 md:p-7 mb-8"
                  style={{ background: PANEL, borderLeft: `3px solid ${GOLD}` }}
                  data-testid="kit-thankyou-fulfillment-note"
                >
                  <p
                    className="uppercase font-bold tracking-[0.22em] mb-2"
                    style={{ color: GOLD, ...mono, fontSize: '11px' }}
                  >
                    Two Things Are Happening
                  </p>
                  <h3 className="text-[18px] md:text-[20px] font-extrabold mb-2 leading-tight" style={{ color: NAVY, ...sans }}>
                    Your kit is in your inbox. Your binder is on the way.
                  </h3>
                  <p className="text-[15px] leading-[1.7] mb-3" style={{ color: 'rgba(10,22,40,0.78)', ...serif }}>
                    A confirmation email with the <strong>{kitName}</strong> Compliance Control System PDF is on its way &mdash; open it now and start using the tools. Your <strong>pre-printed, tabbed physical binder</strong> ships to the address you provided within <strong>{shipWindow}</strong>. You&rsquo;ll receive a separate email when it goes out.
                  </p>
                  <p className="text-[14px] leading-[1.65]" style={{ color: 'rgba(10,22,40,0.65)', ...serif }}>
                    Vince will also schedule the <strong>setup call</strong> included with the Binder Edition after your binder ships &mdash; watch for a scheduling email.
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-md p-6 md:p-7 mb-8"
                  style={{ background: PANEL, borderLeft: `3px solid ${GOLD}` }}
                  data-testid="kit-thankyou-fulfillment-note"
                >
                  <p
                    className="uppercase font-bold tracking-[0.22em] mb-2"
                    style={{ color: GOLD, ...mono, fontSize: '11px' }}
                  >
                    Check your inbox
                  </p>
                  <h3 className="text-[18px] md:text-[20px] font-extrabold mb-2 leading-tight" style={{ color: NAVY, ...sans }}>
                    Your kit was just emailed to you.
                  </h3>
                  <p className="text-[15px] leading-[1.7] mb-3" style={{ color: 'rgba(10,22,40,0.78)', ...serif }}>
                    A confirmation email is on its way to the address you used at checkout &mdash; with your <strong>{kitName}</strong> {tierLabel} attached as a PDF. Open the cover page first: it maps every tool inside and the order to work through them.
                  </p>
                  <p className="text-[14px] leading-[1.65]" style={{ color: 'rgba(10,22,40,0.65)', ...serif }}>
                    Don&rsquo;t see it in a few minutes? Check spam and quarantine for a message from <strong>vince@giglinecompliance.com</strong>. Still nothing? Call <strong>(336) 329-8899</strong> and we&rsquo;ll resend directly.
                  </p>
                </div>
              )}

              <div
                className="rounded-md p-6 md:p-7 mb-8"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
              >
                <h3 className="text-[15px] font-extrabold uppercase tracking-[0.14em] mb-4" style={{ color: NAVY, ...sans }}>
                  What happens next
                </h3>
                {isBinderTier ? (
                  <ol className="space-y-3 text-[14.5px] leading-[1.7]" style={{ color: 'rgba(10,22,40,0.8)', ...serif }}>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>01</span>
                      <span>Open the confirmation email and download the PDF attachment. Save a copy where your team can find it.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>02</span>
                      <span>Start with the <strong>Citation-Proof Score&trade; Rubric</strong> to see where you stand today &mdash; you can begin work now, before your binder arrives.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>03</span>
                      <span>Your printed binder arrives within <strong>{shipWindow}</strong>. Drop your completed forms into the tabbed sections &mdash; that&rsquo;s the artifact an inspector asks for.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>04</span>
                      <span>Vince will email you to schedule the <strong>setup call</strong> after the binder ships.</span>
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-3 text-[14.5px] leading-[1.7]" style={{ color: 'rgba(10,22,40,0.8)', ...serif }}>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>01</span>
                      <span>Open the confirmation email and download the PDF attachment. Save a copy where your team can find it.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>02</span>
                      <span>Start with the <strong>Citation-Proof Score&trade; Rubric</strong> to see where you stand today &mdash; before you build anything.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold" style={{ color: GOLD, ...mono, fontSize: '13px', minWidth: 22 }}>03</span>
                      <span>Run the primary Builder tool for one machine, area, or operator to establish the pattern before rolling it out further.</span>
                    </li>
                  </ol>
                )}
              </div>

              <div className="text-center mb-10">
                <Link
                  to="/citation-proof-kits"
                  className="inline-flex items-center gap-2 font-bold text-[14px] underline hover:no-underline"
                  style={{ color: NAVY, ...sans }}
                  data-testid="kit-thankyou-back-catalog"
                >
                  <ArrowLeft size={14} />
                  Back to the Citation-Proof Kit Series
                </Link>
              </div>

              <div
                className="rounded-md p-5"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
              >
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(10,22,40,0.6)', ...mono }}>
                  Questions?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-[14px]" style={{ color: 'rgba(10,22,40,0.78)', ...serif }}>
                  <a href="tel:+13363298899" className="inline-flex items-center gap-2 hover:underline">
                    <Phone size={14} style={{ color: GOLD }} />
                    (336) 329-8899
                  </a>
                  <a href="mailto:vince@giglinecompliance.com" className="inline-flex items-center gap-2 hover:underline">
                    <Mail size={14} style={{ color: GOLD }} />
                    vince@giglinecompliance.com
                  </a>
                </div>
              </div>
            </div>
          )}

          {!state.loading && !state.verified && (
            <div
              className="rounded-md p-6 md:p-8"
              style={{ background: 'white', border: `1px solid ${BORDER}` }}
              data-testid="kit-thankyou-unverified"
            >
              <h1 className="text-[24px] md:text-[30px] font-extrabold mb-4 leading-tight" style={{ color: NAVY, ...sans }}>
                We couldn&rsquo;t confirm your payment.
              </h1>
              <p className="text-[15px] leading-[1.7] mb-4" style={{ color: 'rgba(10,22,40,0.75)', ...serif }}>
                If you completed checkout, your order may still be processing on Stripe&rsquo;s end. Refresh this page in a minute, or call GigLine directly and we&rsquo;ll confirm on our end.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <a
                  href="tel:+13363298899"
                  className="inline-flex items-center justify-center gap-2 font-bold py-3 px-5 rounded text-[14px]"
                  style={{ background: NAVY, color: 'white', ...sans }}
                >
                  <Phone size={14} />
                  Call (336) 329-8899
                </a>
                <Link
                  to="/citation-proof-kits"
                  className="inline-flex items-center justify-center gap-2 font-bold py-3 px-5 rounded text-[14px]"
                  style={{ background: 'transparent', color: NAVY, border: `1.5px solid ${NAVY}`, ...sans }}
                >
                  Back to Kits
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CitationProofKitThankYouPage;
