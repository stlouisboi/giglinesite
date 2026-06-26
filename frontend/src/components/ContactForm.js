import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = ({ compact = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    operationType: '',
    phone: '',
    email: '',
    serviceType: '',
    message: '',
    smsConsent: false,
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const operationTypeOptions = [
    { value: '', label: 'Select operation type' },
    { value: 'Small Manufacturer / Fabrication Shop', label: 'Small Manufacturer / Fabrication Shop' },
    { value: 'Warehouse / Distribution Center', label: 'Warehouse / Distribution Center' },
    { value: 'Contractor / Maintenance Operation', label: 'Contractor / Maintenance Operation' },
    { value: 'Trucking Fleet', label: 'Trucking Fleet' },
    { value: 'Other', label: 'Other' },
  ];

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    { value: 'not-sure', label: 'Not Sure — Need Advice' },
    { value: 'walkthrough', label: 'Safety Walkthrough & Top 10 Fixes Report' },
    { value: 'documentation', label: 'OSHA Documentation Readiness Review' },
    { value: 'incident', label: 'Incident Review & Corrective Action Support' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Formspree endpoint for Contact Form
      const response = await fetch('https://formspree.io/f/xeeprzel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          operation_type: formData.operationType,
          phone: formData.phone,
          email: formData.email,
          service_type: formData.serviceType,
          message: formData.message,
          sms_consent: formData.smsConsent ? 'YES — opted in' : 'NO',
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Message sent successfully. I will respond within one business day.',
        });
        setFormData({
          name: '',
          operationType: '',
          phone: '',
          email: '',
          serviceType: '',
          message: '',
          smsConsent: false,
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or email directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-border rounded-md bg-white text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-primary mb-1";

  return (
    <form 
      onSubmit={handleSubmit} 
      className={compact ? 'space-y-4' : 'space-y-6'}
      data-testid="contact-form"
    >
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className={inputClasses}
            data-testid="contact-form-name"
          />
        </div>

        <div>
          <label htmlFor="operationType" className={labelClasses}>
            Operation Type <span className="text-red-500">*</span>
          </label>
          <select
            id="operationType"
            name="operationType"
            value={formData.operationType}
            onChange={handleChange}
            required
            className={inputClasses}
            data-testid="contact-form-operation-type"
          >
            {operationTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className={inputClasses}
            data-testid="contact-form-email"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone <span className="text-[#1C2B2B]/40 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="336-555-1234"
            className={inputClasses}
            data-testid="contact-form-phone"
          />
        </div>
      </div>

      <div>
        <label htmlFor="serviceType" className={labelClasses}>
          Service Type <span className="text-red-500">*</span>
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className={inputClasses}
          data-testid="contact-form-service"
        >
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Tell me about your situation
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={compact ? 3 : 4}
          placeholder="Brief description of your needs or questions..."
          className={inputClasses}
          data-testid="contact-form-message"
        />
      </div>

      {status.message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-md ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
          data-testid="contact-form-status"
        >
          {status.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      {/* GL-WEB-014 — SMS opt-in consent checkbox (RingCentral 10DLC requirement) */}
      <div
        className="rounded-md p-4"
        style={{ background: '#F7F9FC', border: '1px solid rgba(11,31,51,0.10)' }}
        data-testid="contact-form-sms-consent-block"
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="smsConsent"
            name="smsConsent"
            checked={formData.smsConsent}
            onChange={handleChange}
            className="mt-1 w-4 h-4 flex-shrink-0 cursor-pointer accent-[#1a6fc4]"
            data-testid="contact-form-sms-consent"
          />
          <span className="text-xs leading-relaxed text-[#1C2B2B]/80">
            By checking this box, I consent to receive SMS from GigLine Safety &amp; Compliance. Reply <strong>STOP</strong> to opt-out; Reply <strong>HELP</strong> for support. Message &amp; data rates may apply. Messaging frequency may vary. View our{' '}
            <a
              href="/privacy-policy"
              className="font-bold underline"
              data-testid="contact-form-sms-privacy-link"
            >
              Privacy Policy
            </a>
            {' '}and{' '}
            <a
              href="/terms-of-service"
              className="font-bold underline"
              data-testid="contact-form-sms-terms-link"
            >
              Terms of Service
            </a>
            .
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="contact-form-submit"
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send size={18} className="mr-2" />
            Send It
          </>
        )}
      </button>

      <p className="text-sm text-muted-foreground text-center mt-4" data-testid="contact-form-expectation">
        I'll reply within one business day with a plain answer: what makes sense, what it costs, when I can be there.
      </p>
    </form>
  );
};

export default ContactForm;
