import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SafetyCheckTeaser = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/50" data-testid="safety-check-teaser">
      <div className="container max-w-4xl">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">
          GigLine Safety Check
        </p>
        
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          Six Questions. 90 Seconds. A Clear Picture of Where You Stand.
        </h2>
        
        <p className="text-muted-foreground mb-8">
          These are the violations OSHA cites most often in small operations. Answer honestly — this is for your operation, not for show.
        </p>

        {/* Preview Questions */}
        <div className="space-y-4 mb-8">
          <div className="border-l-4 border-accent/40 pl-4 py-2">
            <p className="text-primary">
              Do you have a written Hazard Communication program and can your people find the SDS for every chemical on site right now?
            </p>
            <p className="text-sm text-muted-foreground mt-1">29 CFR 1910.1200</p>
          </div>
          
          <div className="border-l-4 border-accent/40 pl-4 py-2">
            <p className="text-primary">
              Are your forklift operators certified in the last three years and are daily pre-shift inspections documented?
            </p>
            <p className="text-sm text-muted-foreground mt-1">29 CFR 1910.178</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          to="/safety-check" 
          className="btn-primary inline-flex items-center gap-2"
          data-testid="safety-check-teaser-cta"
        >
          Run the Full Safety Check
          <ArrowRight size={18} />
        </Link>

        {/* Credential Anchor Line */}
        <p className="text-sm text-muted-foreground mt-6">
          Built on OSHA's most cited violations in general industry. Reviewed by a 25-year safety professional.
        </p>
      </div>
    </section>
  );
};

export default SafetyCheckTeaser;
