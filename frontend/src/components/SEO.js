import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  canonical,
  ogType = 'website',
  noindex = false,
  schema
}) => {
  const siteName = 'GigLine Safety & Compliance';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Safety Walkthroughs & Gap Checks for Small Operations`;
  const baseUrl = 'https://www.giglinecompliance.com';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;

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
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      
      {/* Schema.org JSON-LD — supports single object or array of schemas */}
      {schema && (Array.isArray(schema) ? schema : [schema]).map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
