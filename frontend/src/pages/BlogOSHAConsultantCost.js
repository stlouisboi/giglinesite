import React, { useEffect } from 'react';

const BlogOSHAConsultantCost = () => {
  useEffect(() => {
    window.location.replace('/previews/osha-safety-consultant-cost/');
  }, []);

  return (
    <main className="min-h-screen bg-[#102A43] text-white flex items-center justify-center p-8">
      <p className="text-center">Opening the revised draft article preview.</p>
    </main>
  );
};

export default BlogOSHAConsultantCost;
