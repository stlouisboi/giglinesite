import React, { useState } from 'react';
import { Calendar, CreditCard, Phone, ArrowRight, X } from 'lucide-react';

// Calendly URL placeholder - replace with actual URL when ready
const CALENDLY_URL = "https://calendly.com/your-calendly-url";

const BookingModal = ({ isOpen, onClose, service }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });

  if (!isOpen || !service) return null;

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: service.type,
          origin_url: window.location.origin,
          customer_email: customerInfo.email,
          customer_name: customerInfo.name
        })
      });

      if (!response.ok) throw new Error('Failed to create checkout');
      
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Unable to process payment. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalendlyClick = () => {
    // Open Calendly in new tab or use popup
    window.open(CALENDLY_URL, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" data-testid="booking-modal">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          data-testid="close-modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-primary mb-2">{service.name}</h2>
        <p className="text-muted-foreground text-sm mb-4">{service.description}</p>

        {service.hasFixedPrice ? (
          <>
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <p className="text-2xl font-bold text-accent">${service.amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">One-time payment</p>
            </div>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                data-testid="customer-name-input"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                data-testid="customer-email-input"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="pay-now-button"
            >
              <CreditCard size={18} />
              {isLoading ? 'Processing...' : 'Pay & Book Now'}
            </button>
          </>
        ) : (
          <>
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <p className="text-lg font-semibold text-primary">Custom Quote Required</p>
              <p className="text-sm text-muted-foreground">
                Starting at ${service.startingAt}. Final price depends on scope.
              </p>
            </div>

            <button
              onClick={handleCalendlyClick}
              className="w-full btn-primary flex items-center justify-center gap-2"
              data-testid="schedule-call-button"
            >
              <Calendar size={18} />
              Schedule a Scoping Call
            </button>
          </>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Questions? Call <a href="tel:336-671-4967" className="text-accent hover:underline">336-671-4967</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Service configuration with booking options
export const serviceConfig = {
  // Fixed price services (can pay directly)
  walkthrough_small: {
    type: 'walkthrough_small',
    name: 'Safety Walkthrough - Small Site',
    description: 'Local small site, single building, 1 shift. Full walkthrough with Top 10 Fixes Report.',
    amount: 650.00,
    hasFixedPrice: true
  },
  walkthrough_standard: {
    type: 'walkthrough_standard', 
    name: 'Safety Walkthrough - Standard',
    description: 'Standard site walkthrough with comprehensive report.',
    amount: 750.00,
    hasFixedPrice: true
  },
  documentation_remote: {
    type: 'documentation_remote',
    name: 'Documentation Review - Remote',
    description: 'Send your PDFs/scans for remote safety documentation review.',
    amount: 550.00,
    hasFixedPrice: true
  },
  documentation_onsite: {
    type: 'documentation_onsite',
    name: 'Documentation Review - On-site',
    description: 'On-site document review with follow-up.',
    amount: 750.00,
    hasFixedPrice: true
  },
  incident_standard: {
    type: 'incident_standard',
    name: 'Incident Review - Standard',
    description: 'Non-emergency, single incident review with corrective action support.',
    amount: 900.00,
    hasFixedPrice: true
  },
  
  // Quote required services (goes to Calendly)
  walkthrough_large: {
    type: 'walkthrough_large',
    name: 'Safety Walkthrough - Large/Complex Site',
    description: 'Multiple buildings, long drive, or complex operations.',
    startingAt: 900,
    hasFixedPrice: false
  },
  documentation_complex: {
    type: 'documentation_complex',
    name: 'Documentation Review - Multiple Locations',
    description: 'Multiple locations or extensive documentation scope.',
    startingAt: 750,
    hasFixedPrice: false
  },
  incident_urgent: {
    type: 'incident_urgent',
    name: 'Incident Review - Urgent/Complex',
    description: 'High-urgency, serious injury, or complex multi-day cases.',
    startingAt: 1200,
    hasFixedPrice: false
  }
};

export default BookingModal;
