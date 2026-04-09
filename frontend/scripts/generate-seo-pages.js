/**
 * Post-build SEO script
 * Generates per-route HTML files with correct meta tags pre-baked
 * so Google's crawler sees unique metadata for each page without JS execution.
 * 
 * Runs after `craco build` — creates /about/index.html, /contact/index.html, etc.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const BASE_URL = 'https://www.giglinecompliance.com';

const routes = [
  {
    path: '/about',
    title: 'About | GigLine Safety & Compliance',
    description: 'Vince Lawrence — safety consultant, OSHA 30-Hour certified, U.S. Navy veteran. 25+ years in manufacturing, fleet, and warehouse safety. Based in Kernersville, NC.',
    canonical: '/about',
  },
  {
    path: '/services',
    title: 'Services | GigLine Safety & Compliance',
    description: 'Three focused safety services for small operations. Safety Walkthrough ($650), Documentation Review ($550), and Incident Response Support ($900). Each ends with a written report and clear action items.',
    canonical: '/services',
  },
  {
    path: '/contact',
    title: 'Contact | GigLine Safety & Compliance',
    description: 'Contact GigLine Safety & Compliance. Request a walkthrough, documentation review, or incident response support. Vince Lawrence — (336) 329-8899. Kernersville, NC.',
    canonical: '/contact',
  },
  {
    path: '/safety-check',
    title: 'Safety Check | GigLine Safety & Compliance',
    description: 'Free 90-second safety check. Six questions mapped to OSHA\'s most-cited violations. Get an instant GO / WAIT / NO-GO rating and a PDF report with next steps.',
    canonical: '/safety-check',
  },
  {
    path: '/hazcom',
    title: 'HazCom Starter Pack | GigLine Safety & Compliance',
    description: 'HazCom Starter Pack — $29. Written HazCom program, SDS binder checklist, and training log. 11 pages. Fill your company name. Print. Done. Fixes OSHA\'s #1 citation in general industry.',
    canonical: '/hazcom',
  },
  {
    path: '/blog/top-5-osha-violations-small-manufacturing',
    title: 'Top 5 OSHA Violations in Small Manufacturing | GigLine Safety & Compliance',
    description: 'The five most-cited OSHA violations in small manufacturing: Hazard Communication, Lockout/Tagout, Machine Guarding, Powered Industrial Trucks, and Walking-Working Surfaces. Includes CFR references, penalty amounts, and compliance requirements.',
    canonical: '/blog/top-5-osha-violations-small-manufacturing',
  },
  {
    path: '/blog/hazcom-requirements-small-business',
    title: 'HazCom Requirements for Small Businesses | GigLine Safety & Compliance',
    description: 'Complete guide to OSHA Hazard Communication requirements for small businesses. Covers written programs, Safety Data Sheets, labeling, training, and penalties under 29 CFR 1910.1200.',
    canonical: '/blog/hazcom-requirements-small-business',
  },
  {
    path: '/request-walkthrough',
    title: 'Request a Safety Walkthrough | GigLine Safety & Compliance',
    description: 'Request an on-site safety walkthrough for your operation. One visit. Clear findings. No retainer. Written report within 24-48 hours. Kernersville, NC.',
    canonical: '/request-walkthrough',
  },
];

function generateRouteHTML(templateHTML, route) {
  let html = templateHTML;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${route.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${BASE_URL}${route.canonical}" />`
  );

  // Replace og:url
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${BASE_URL}${route.canonical}" />`
  );

  // Replace og:title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${route.title}" />`
  );

  // Replace og:description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${route.description}" />`
  );

  // Replace twitter:title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${route.title}" />`
  );

  // Replace twitter:description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  return html;
}

function main() {
  const templatePath = path.join(BUILD_DIR, 'index.html');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Build index.html not found. Run craco build first.');
    process.exit(1);
  }

  const templateHTML = fs.readFileSync(templatePath, 'utf-8');
  let generated = 0;

  for (const route of routes) {
    const routeDir = path.join(BUILD_DIR, route.path);
    const routeFile = path.join(routeDir, 'index.html');

    // Create directory if it doesn't exist
    fs.mkdirSync(routeDir, { recursive: true });

    // Generate and write the route-specific HTML
    const routeHTML = generateRouteHTML(templateHTML, route);
    fs.writeFileSync(routeFile, routeHTML);
    generated++;
    console.log(`  SEO: ${route.path}/index.html`);
  }

  console.log(`\nSEO: Generated ${generated} route-specific HTML files.`);
}

main();
