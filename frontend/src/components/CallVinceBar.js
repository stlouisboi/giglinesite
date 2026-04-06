import React from 'react';

const CallVinceBar = ({ message = "Ready to talk through your operation?" }) => {
  return (
    <div className="w-full border-y border-[#1C2B2B]/10 bg-white py-5 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
        
        <p className="text-sm text-[#1C2B2B]/60">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <a 
            href="tel:3363298899"
            className="text-[#1C2B2B] font-medium text-base hover:text-[#B8972C] transition-colors"
            data-testid="call-vince-phone"
          >
            336-329-8899
          </a>
          <span className="hidden sm:inline text-[#1C2B2B]/30">&middot;</span>
          <a 
            href="mailto:vince@giglinecompliance.com"
            className="text-[#1C2B2B] font-medium text-base hover:text-[#B8972C] transition-colors"
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
