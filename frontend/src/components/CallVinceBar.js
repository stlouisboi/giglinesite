import React from 'react';

const CallVinceBar = ({ message = "Ready to talk through your operation?" }) => {
  return (
    <div className="w-full bg-[#102A43] py-5 px-4 border-y border-[#C9A84C]/20">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
        
        <p className="text-sm text-white/50">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <a
            href="tel:+13363298899"
            className="text-[#C9A84C] font-bold text-lg hover:text-white transition-colors"
            data-testid="call-vince-phone"
          >
            (336) 329-8899
          </a>
          <span className="hidden sm:inline text-white/20">&middot;</span>
          <a 
            href="mailto:vince@giglinecompliance.com"
            className="text-white font-medium text-base hover:text-[#C9A84C] transition-colors"
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
