import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Download, Phone, Mail, Star, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import { trackReviewClick } from '../utils/analytics';

const API = process.env.REACT_APP_BACKEND_URL;
const C = { bg: '#1A1A1A', surface: '#222222', deep: '#111111', gold: '#2A52A0', white: '#FFFFFF', sec: 'rgba(255,255,255,0.65)', muted: 'rgba(255,255,255,0.38)', border: 'rgba(255,255,255,0.08)' };

const ReportPage = () => {
  const { clientToken } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/report/${clientToken}`)
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
        <h1 className="text-xl font-bold text-white mb-3">Report not available</h1>
        <p className="text-sm mb-6" style={{ color: C.sec }}>This report link may be expired, or the report is not yet ready. Contact GigLine for assistance.</p>
        <p className="text-xs" style={{ color: C.muted }}>
          <a href="tel:3363298899" className="hover:text-white transition-colors">(336) 329-8899</a> · <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
        </p>
      </div>
    </div>
  );

  const pdfUrl = `${API}/api/report/${clientToken}/download`;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <SEO title={`Safety Check Report — ${data.company} | GigLine`} description="View your GigLine Safety Check report." canonical={`/report/${clientToken}`} />

      {/* Nav */}
      <nav style={{ background: C.deep, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: C.gold }}><Check size={14} color="#111" /></div>
            <span className="text-sm font-bold text-white">GigLine Safety & Compliance</span>
          </div>
          <span className="text-xs" style={{ color: C.muted }}>Safety Check Report</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1" data-testid="report-heading">Your Safety Check Report</h1>
          <p className="text-sm" style={{ color: C.muted }}>{data.company} · Delivered {data.reportDeliveredAt ? new Date(data.reportDeliveredAt).toLocaleDateString() : ''}</p>
        </div>

        {/* PDF Viewer */}
        <div className="rounded-lg overflow-hidden mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <iframe src={pdfUrl} title="Safety Check Report" className="w-full" style={{ height: '70vh', border: 'none' }} data-testid="report-pdf-viewer" />
        </div>

        {/* Download button */}
        <div className="flex items-center justify-between">
          <a href={pdfUrl} download className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all hover:brightness-110"
            style={{ background: C.gold, color: '#111' }} data-testid="report-download-btn">
            <Download size={16} /> Download PDF
          </a>
          <p className="text-xs" style={{ color: C.muted }}>
            <a href="tel:3363298899" className="hover:text-white transition-colors">(336) 329-8899</a> · <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
          </p>
        </div>

        {/* Review prompt — highest-intent moment (after reading the report) */}
        <div
          className="mt-8 rounded-lg p-6"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
          data-testid="review-prompt"
        >
          <div className="flex items-center gap-1 mb-3" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={16} fill={C.gold} color={C.gold} strokeWidth={0} />
            ))}
          </div>
          <p className="text-base font-bold text-white mb-2" data-testid="review-prompt-headline">
            If this report was useful, would you share a quick review?
          </p>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: C.sec }}>
            Small operations trust other operators more than marketing. A few sentences on Google helps other Triad businesses find GigLine.
          </p>
          <a
            href="https://g.page/r/CdlAYUu_I3xpEAI/review?utm_source=report-pdf&utm_medium=app&utm_campaign=review-request"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackReviewClick('report_page')}
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
      </div>
    </div>
  );
};

export default ReportPage;
