import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Download, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const HazComThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, verified, invalid
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const sid = searchParams.get('session_id');
    if (!sid) {
      navigate('/hazcom', { replace: true });
      return;
    }
    setSessionId(sid);

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hazcom/verify?session_id=${sid}`);
        const data = await res.json();
        if (data.verified) {
          setStatus('verified');
        } else {
          setStatus('invalid');
        }
      } catch {
        setStatus('invalid');
      }
    };
    verify();
  }, [searchParams, navigate]);

  const downloadUrl = (filename) =>
    `${API_URL}/api/hazcom/download/${filename}?session_id=${sessionId}`;

  if (status === 'loading') {
    return (
      <main className="min-h-[60vh] flex items-center justify-center" data-testid="hazcom-thankyou-loading">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-[#1F6FEB] mx-auto mb-4" />
          <p className="text-[#102133]/60">Verifying your purchase...</p>
        </div>
      </main>
    );
  }

  if (status === 'invalid') {
    return (
      <main className="min-h-[60vh] flex items-center justify-center" data-testid="hazcom-thankyou-invalid">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-[#102133] mb-4">Session Not Found</h1>
          <p className="text-[#102133]/60 mb-6">
            This download link is invalid or has expired. If you've already purchased, check your email for the download links.
          </p>
          <Link
            to="/hazcom"
            className="inline-flex items-center gap-2 bg-[#102133] hover:bg-[#2A3D3D] text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            Back to HazCom Starter Pack
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const files = [
    { filename: 'GL-HAZCOM-001_Written_Program.pdf', label: 'GL-HAZCOM-001 — Written HazCom Program', desc: '5 pages' },
    { filename: 'GL-HAZCOM-002_SDS_Binder_Checklist.pdf', label: 'GL-HAZCOM-002 — SDS Binder Checklist + Index', desc: '4 pages' },
    { filename: 'GL-HAZCOM-003_Training_Log.pdf', label: 'GL-HAZCOM-003 — Training Verification Log', desc: '2 pages' },
  ];

  return (
    <main data-testid="hazcom-thankyou-page">
      <SEO
        title="Download Your HazCom Starter Pack"
        description="Your HazCom Starter Pack is ready for download."
        canonical="/hazcom/thank-you"
        noindex
      />

      {/* Hero */}
      <section className="bg-[#102133] text-white py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={28} className="text-[#1F6FEB]" />
            <p className="text-xs font-semibold tracking-widest text-[#1F6FEB] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              PURCHASE COMPLETE
            </p>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="hazcom-thankyou-headline"
          >
            Download Your Files
          </h1>
          <p className="text-white/70">
            Thank you for your purchase. Your HazCom Starter Pack is ready.
          </p>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-12 md:py-16" data-testid="hazcom-download-section">
        <div className="container max-w-3xl">
          <div className="space-y-4 mb-12">
            {files.map((file) => (
              <a
                key={file.filename}
                href={downloadUrl(file.filename)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-[#F9F8F6] border border-[#102133]/10 rounded hover:border-[#1F6FEB]/40 transition-colors group"
                data-testid={`download-${file.filename.split('.')[0]}`}
              >
                <div>
                  <p className="font-medium text-[#102133] text-sm group-hover:text-[#1F6FEB] transition-colors">
                    {file.label}
                  </p>
                  <p className="text-xs text-[#102133]/50 mt-1">{file.desc} — PDF</p>
                </div>
                <Download size={20} className="text-[#102133]/40 group-hover:text-[#1F6FEB] transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>

          <p className="text-sm text-[#102133]/50 mb-12">
            A copy has also been sent to your email.
          </p>

          {/* Next Steps */}
          <div className="border-t border-[#102133]/10 pt-10 mb-12">
            <h2
              className="text-lg font-bold text-[#102133] mb-6"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Next Steps
            </h2>
            <ol className="space-y-3">
              {[
                'Open each PDF and fill in your company name',
                'Print and place in your SDS binder',
                'Train employees and document on the training log',
                'Review annually or when chemicals change',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[#102133]/70 text-sm">
                  <span className="bg-[#1F6FEB] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Need More Help */}
          <div className="bg-[#F9F8F6] border border-[#102133]/10 rounded p-8">
            <h2
              className="text-lg font-bold text-[#102133] mb-4"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Need More Help?
            </h2>
            <p className="text-sm text-[#102133]/60 mb-6">
              If your operation needs a full walkthrough or documentation review:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#102133] hover:bg-[#2A3D3D] text-white font-medium px-5 py-3 rounded transition-colors text-sm"
                data-testid="thankyou-cta-walkthrough"
              >
                Request a Walkthrough — $1,200+
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/safety-check"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#102133]/20 hover:border-[#102133]/40 text-[#102133] font-medium px-5 py-3 rounded transition-colors text-sm"
                data-testid="thankyou-cta-safety-check"
              >
                Run the Safety Check — Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HazComThankYouPage;
