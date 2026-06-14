import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  canonical,
  ogType = 'website',
  ogImage,
  noindex = false,
  schema
}) => {
  const siteName = 'GigLine Safety & Compliance';
  const defaultTitle = `${siteName} | Safety Walkthroughs & Documentation Readiness Reviews for Small Operations`;
  // Smart suffix: only append site name if title doesn't already end with it (or with "GigLine")
  const needsSuffix = title && !/\|\s*GigLine\b/i.test(title);
  const fullTitle = title
    ? (needsSuffix ? `${title} | ${siteName}` : title)
    : defaultTitle;
  const baseUrl = 'https://www.giglinecompliance.com';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const ogImageUrl = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* JSON-LD schemas are injected exclusively by /scripts/generate-seo-pages.js
          into the pre-rendered static HTML. We deliberately do NOT emit them via
          Helmet at runtime to avoid duplicate-schema warnings in Google Search
          Console (e.g. "Duplicate field FAQPage"). The `schema` prop is still
          accepted for API compatibility but ignored here. */}
    </Helmet>
  );
};

export default SEO;
