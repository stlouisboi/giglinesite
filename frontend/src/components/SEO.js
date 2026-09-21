import React, { useLayoutEffect } from 'react';
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

  // The build pre-renders a set of meta tags into the static HTML (serves crawlers
  // that don't run JS). react-helmet-async marks the tags it manages with data-rh,
  // so before Helmet's tags settle we strip any pre-rendered copies of the same
  // per-page tags. Tags Helmet doesn't manage (og:image:width/height/alt, the
  // Pinterest og:image variant) survive because they don't match these selectors.
  useLayoutEffect(() => {
    const selector = [
      'meta[name="description"]',
      'meta[property="og:url"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:type"]',
      'meta[property="og:site_name"]',
      'meta[property="og:image"]',
      'meta[name="twitter:card"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:image"]',
      'link[rel="canonical"]',
      'link[rel="alternate"]',
    ].join(',');
    document.head.querySelectorAll(selector).forEach((el) => {
      if (!el.hasAttribute('data-rh')) el.remove();
    });
  }, [canonical]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-us" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow, noarchive" />}
      
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
