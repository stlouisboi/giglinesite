import React from 'react';

const CallVinceBar = ({ message = "Ready to talk through your operation?" }) => {
  return (
    <div className="w-full border-y border-border bg-white py-5 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
        
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          
          {/* Phone — tap to call on mobile */}
          <a 
            href="tel:3366714967"
            className="text-primary font-medium text-base hover:text-accent transition-colors"
            data-testid="call-vince-phone"
          >
            336-671-4967
          </a>
          
          {/* Divider — desktop only */}
          <span className="hidden sm:inline text-muted-foreground">·</span>
          
          {/* Email */}
          <a 
            href="mailto:vince@giglinecompliance.com"
            className="text-primary font-medium text-base hover:text-accent transition-colors"
            data-testid="call-vince-email"
          >
            vince@giglinecompliance.com
          </a>
          
        </div>
      </div>
    </div>
  );
};

export default CallVinceBar;
