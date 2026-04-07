import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight, Phone, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    document.title = "Payment Status | GigLine Safety & Compliance";
    
    const pollPaymentStatus = async (sessionId, attempts = 0) => {
      const maxAttempts = 5;
      const pollInterval = 2000;

      if (attempts >= maxAttempts) {
        setStatus('timeout');
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/payments/status/${sessionId}`
        );
        
        if (!response.ok) throw new Error('Failed to check status');
        
        const data = await response.json();
        setPaymentData(data);

        if (data.payment_status === 'paid') {
          setStatus('success');
          return;
        } else if (data.status === 'expired') {
          setStatus('expired');
          return;
        }

        // Continue polling if still pending
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
      } catch (error) {
        console.error('Status check error:', error);
        if (attempts < maxAttempts - 1) {
          setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
        } else {
          setStatus('error');
        }
      }
    };

    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center py-16" data-testid="payment-success-page">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container max-w-lg">
        <div className="card text-center p-8">
          {status === 'loading' && (
            <>
              <Loader size={64} className="mx-auto text-accent animate-spin mb-4" />
              <h1 className="text-2xl font-bold text-primary mb-2">Processing Payment</h1>
              <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
              <h1 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your payment. I'll be in touch within one business day to schedule your {paymentData?.metadata?.service_name || 'service'}.
              </p>
              
              {paymentData && (
                <div className="bg-secondary rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-1">Service:</p>
                  <p className="font-semibold text-primary mb-2">{paymentData.metadata?.service_name}</p>
                  <p className="text-sm text-muted-foreground mb-1">Amount Paid:</p>
                  <p className="font-semibold text-primary">${(paymentData.amount_total / 100).toFixed(2)} {paymentData.currency?.toUpperCase()}</p>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">What happens next:</p>
                <ol className="text-sm text-left space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-accent">1.</span>
                    You'll receive a confirmation email
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-accent">2.</span>
                    I'll contact you to schedule the engagement
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-accent">3.</span>
                    After completion, you'll receive your written report
                  </li>
                </ol>
              </div>

              <Link to="/" className="btn-primary mt-6 inline-flex items-center gap-2">
                Return Home <ArrowRight size={18} />
              </Link>
            </>
          )}

          {(status === 'error' || status === 'expired' || status === 'timeout') && (
            <>
              <XCircle size={64} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-primary mb-2">
                {status === 'expired' ? 'Session Expired' : 'Something Went Wrong'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {status === 'expired' 
                  ? 'Your payment session has expired. Please try again.'
                  : 'We couldn\'t confirm your payment. If you were charged, please contact us.'}
              </p>

              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-primary mb-2">Need help?</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:336-329-8899" className="flex items-center gap-2 text-accent hover:underline justify-center">
                    <Phone size={16} /> 336-329-8899
                  </a>
                  <a href="mailto:vince@giglinecompliance.com" className="flex items-center gap-2 text-accent hover:underline justify-center">
                    <Mail size={16} /> vince@giglinecompliance.com
                  </a>
                </div>
              </div>

              <Link to="/services" className="btn-secondary inline-flex items-center gap-2">
                Try Again <ArrowRight size={18} />
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
