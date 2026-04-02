'use client';

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  return (
    <form
      action="https://formspree.io/f/xgvkbjze"
      method="POST"
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-white/80">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1 text-white/80">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Business or organization"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1 text-white/80">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your phone number"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-white/80">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="_replyto"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium mb-1 text-white/80">
          Service Type
        </label>
        <select
          id="service"
          name="service"
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
        >
          <option value="">Select a service…</option>
          <option value="Safety Walkthrough">Safety Walkthrough &amp; Top 10 Fixes Report</option>
          <option value="Documentation Review">Safety Documentation Review &amp; Gap Check</option>
          <option value="Incident Review">Incident Review &amp; Corrective Action Support</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-white/80">
          Tell me a bit about your operation
        </label>
        <textarea
          id="description"
          name="description"
          rows={compact ? 4 : 5}
          placeholder="What you do, how many employees, any specific concerns…"
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent resize-vertical"
        />
      </div>

      <button
        type="submit"
        className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded transition-colors text-sm"
      >
        Send — I will respond within one business day
      </button>
    </form>
  );
}
