import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Phone, Mail, Star, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;
const C = { bg: '#1A1A1A', surface: '#222222', deep: '#111111', gold: '#E8B84B', white: '#FFFFFF', sec: 'rgba(255,255,255,0.65)', muted: 'rgba(255,255,255,0.38)', border: 'rgba(255,255,255,0.08)' };

const StatusPage = () => {
  const { clientToken } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/status/${clientToken}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [clientToken]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${C.gold} transparent ${C.gold} ${C.gold}` }} />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <div className="text-center max-w-sm">
        <h1 className="text-xl font-bold text-white mb-3">Link not found</h1>
        <p className="text-sm mb-6" style={{ color: C.sec }}>This status link may be expired or incorrect. Contact GigLine for assistance.</p>
        <p className="text-xs" style={{ color: C.muted }}>
          <a href="tel:3363298899" className="hover:text-white transition-colors">(336) 329-8899</a> · <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <SEO title={`Status — ${data.company} | GigLine`} description="Track your GigLine engagement status." canonical={`/status/${clientToken}`} />

      {/* Nav */}
      <nav style={{ background: C.deep, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: C.gold }}><Check size={14} color="#111" /></div>
            <span className="text-sm font-bold text-white">GigLine Safety & Compliance</span>
          </div>
          <span className="text-xs" style={{ color: C.muted }}>Client Status</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* Client info */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-1" data-testid="status-company">{data.company}</h1>
          <p className="text-sm" style={{ color: C.muted }}>{data.contactName}</p>
        </div>

        {/* Timeline */}
        <div className="space-y-0" data-testid="status-timeline">
          {data.stages.map((stage, i) => {
            const isLast = i === data.stages.length - 1;
            return (
              <div key={stage.key} className="flex gap-4" data-testid={`stage-${stage.key}`}>
                {/* Dot + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {stage.state === 'completed' ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.gold }}>
                      <Check size={14} color="#111" />
                    </div>
                  ) : stage.state === 'current' ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center relative" style={{ border: `2px solid ${C.gold}` }}>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: C.gold }} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.12)' }} />
                  )}
                  {!isLast && (
                    <div className="w-0.5 flex-grow min-h-[40px]" style={{ background: stage.state === 'completed' ? C.gold : C.border }} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                  <p className="text-sm font-bold mb-0.5"
                    style={{ color: stage.state === 'upcoming' ? C.muted : C.white }}>
                    {stage.label}
                  </p>
                  <p className="text-xs mb-2" style={{ color: C.muted }}>{stage.description}</p>
                  {stage.state === 'current' && (
                    <div className="rounded-lg p-4 mt-2" style={{ background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.15)' }}>
                      <p className="text-sm" style={{ color: C.sec }}>{stage.message}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Report link if delivered */}
        {data.reportUrl && (
          <div className="mt-8 rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-sm font-bold text-white mb-2">Your Safety Check Report</p>
            <a href={`/report/${clientToken}`} className="text-sm font-medium transition-colors" style={{ color: C.gold }} data-testid="view-report-link">
              View your report →
            </a>
          </div>
        )}

        {/* Review prompt — only shows once engagement is complete (report delivered) */}
        {data.status === 'report_delivered' && (
          <div
            className="mt-6 rounded-lg p-6"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
            data-testid="review-prompt"
          >
            <div className="flex items-center gap-1 mb-3" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={16} fill={C.gold} color={C.gold} strokeWidth={0} />
              ))}
            </div>
            <p className="text-base font-bold text-white mb-2" data-testid="review-prompt-headline">
              If this walkthrough helped, would you share a quick review?
            </p>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: C.sec }}>
              Small operations trust other operators more than marketing. A few sentences on Google goes a long way in helping other Triad businesses find GigLine.
            </p>
            <a
              href="https://share.google/iUzTnuRSCNdguZQww"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: C.gold, color: '#111', minHeight: '44px' }}
              data-testid="review-prompt-cta"
            >
              Leave a Review on Google
              <ExternalLink size={14} />
            </a>
            <p className="text-xs mt-4" style={{ color: C.muted }}>
              Honest feedback only — good, bad, or indifferent.
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-xs" style={{ color: C.muted }}>
            <a href="tel:3363298899" className="hover:text-white transition-colors inline-flex items-center gap-1"><Phone size={11} /> (336) 329-8899</a>
            <span className="mx-2">·</span>
            <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors inline-flex items-center gap-1"><Mail size={11} /> vince@giglinecompliance.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
