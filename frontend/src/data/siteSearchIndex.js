/**
 * Sitewide search index. Static, hand-curated for high-precision results.
 * Each entry: { title, path, type, keywords }
 * - `type` is one of: Page, Service, Field Note, FAQ, Resource, Lead Magnet, Case Study, Blog
 * - `keywords` is a space-separated list of synonyms / search-friendly terms
 */

export const SITE_SEARCH_INDEX = [
  // ── Core pages ─────────────────────────────────────────
  { title: 'Home', path: '/', type: 'Page', keywords: 'home main landing find gaps before osha walkthrough' },
  { title: 'About Vince Lawrence', path: '/about', type: 'Page', keywords: 'about vince lawrence founder navy veteran kernersville bio team' },
  { title: 'Contact', path: '/contact', type: 'Page', keywords: 'contact phone email address kernersville triad nc 336' },
  { title: 'FAQ', path: '/faq', type: 'Page', keywords: 'faq frequently asked questions answers' },
  { title: 'Resources', path: '/resources', type: 'Page', keywords: 'resources downloads guides field manual safety check' },
  { title: 'Privacy Policy', path: '/privacy-policy', type: 'Page', keywords: 'privacy policy data gdpr' },
  { title: 'Terms of Service', path: '/terms-of-service', type: 'Page', keywords: 'terms of service legal agreement' },

  // ── Services ───────────────────────────────────────────
  { title: 'Services Overview', path: '/services', type: 'Page', keywords: 'services overview osha compliance consulting' },
  { title: 'Safety Walkthrough', path: '/safety-walkthrough', type: 'Service', keywords: 'safety walkthrough on-site visit hazard photo documentation cfr penalty exposure 48 hours' },
  { title: 'Compliance Readiness Visit', path: '/services/compliance-readiness-visit', type: 'Service', keywords: 'compliance readiness gap analysis pre-inspection prep program documentation' },
  { title: 'Document Development', path: '/services/document-development', type: 'Service', keywords: 'document program development written iipp hazcom loto bloodborne ergo respiratory' },
  { title: 'Incident Review', path: '/services/incident-review', type: 'Service', keywords: 'incident investigation review post-accident root cause corrective action' },
  { title: 'Annual Compliance Partner', path: '/services/annual-compliance-partner', type: 'Service', keywords: 'annual retainer ongoing partner monthly support recurring' },
  { title: 'OSHA-Ready Control System', path: '/services/osha-ready-control-system', type: 'Service', keywords: 'control system kit pack starter supervisor' },

  // ── Service-area landing pages (P1) ────────────────────
  { title: 'Forklift Compliance Review (NC)', path: '/forklift-compliance-review-nc', type: 'Service', keywords: 'forklift powered industrial truck pit 1910.178 training certification operator' },
  { title: 'Lockout/Tagout (LOTO) Procedure Review (NC)', path: '/loto-procedure-review-nc', type: 'Service', keywords: 'lockout tagout loto 1910.147 energy control procedure machine-specific' },
  { title: 'OSHA Documentation Review (NC)', path: '/osha-documentation-review-nc', type: 'Service', keywords: 'documentation review program written record audit' },

  // ── Case Study ─────────────────────────────────────────
  { title: 'Case Study: Metals Fabrication, Statesville NC', path: '/case-study/metals-fabrication-statesville', type: 'Case Study', keywords: 'case study metals fabrication statesville propane machine guarding hazcom' },

  // ── Pillar / Hub pages ─────────────────────────────────
  { title: 'OSHA Compliance Guide', path: '/osha-compliance-guide', type: 'Page', keywords: 'osha compliance guide pillar overview general industry' },
  { title: 'Service Areas (Piedmont Triad)', path: '/service-areas', type: 'Page', keywords: 'service area piedmont triad nc kernersville winston-salem greensboro high point' },

  // ── Lead magnets ───────────────────────────────────────
  { title: 'Free Safety Check (5 questions)', path: '/safety-check', type: 'Lead Magnet', keywords: 'safety check free quiz score risk level high medium low' },
  { title: 'Sample Walkthrough Report (PDF)', path: '/sample-report', type: 'Lead Magnet', keywords: 'sample walkthrough report pdf example deliverable findings cfr' },
  { title: 'Heat Stress Prevention Guide', path: '/heat-stress-prevention', type: 'Lead Magnet', keywords: 'heat stress prevention guide download summer warm weather hydration' },
  { title: 'OSHA Inspection Prep Guide (HR)', path: '/osha-inspection-prep-guide', type: 'Lead Magnet', keywords: 'osha inspection prep hr human resources opening conference walkthrough closing' },
  { title: 'HazCom Compliance Pack', path: '/hazcom', type: 'Lead Magnet', keywords: 'hazcom hazard communication sds safety data sheet program training' },

  // ── Field Notes (25 — comprehensive index) ─────────────
  { title: 'Field Note: AI-Generated Safety Programs', path: '/field-notes/ai-generated-safety-programs', type: 'Field Note', keywords: 'ai chatgpt generated safety programs template missing elements' },
  { title: 'Field Note: Heat Stress', path: '/field-notes/heat-stress', type: 'Field Note', keywords: 'heat stress prevention plan hydration summer warm weather' },
  { title: 'Field Note: Forklift Safety', path: '/field-notes/forklift-safety', type: 'Field Note', keywords: 'forklift powered industrial truck pit safety operator training' },
  { title: 'Field Note: Electrical Access', path: '/field-notes/electrical-safety', type: 'Field Note', keywords: 'electrical 1910.303 panel access lockout shock arc flash' },
  { title: 'Field Note: HazCom & SDS', path: '/field-notes/hazcom', type: 'Field Note', keywords: 'hazcom hazard communication sds safety data sheet binder labeling' },
  { title: 'Field Note: Machine Guarding', path: '/field-notes/machine-guarding', type: 'Field Note', keywords: 'machine guarding 1910.212 point of operation shear blade barrier' },
  { title: 'Field Note: Walking Surfaces', path: '/field-notes/walking-surfaces', type: 'Field Note', keywords: 'walking working surfaces housekeeping trip slip floor obstruction' },
  { title: 'Field Note: Lockout/Tagout (LOTO)', path: '/field-notes/lockout-tagout', type: 'Field Note', keywords: 'lockout tagout loto 1910.147 energy isolation control procedure' },
  { title: 'Field Note: Emergency Action Plans', path: '/field-notes/emergency-action-plans', type: 'Field Note', keywords: 'emergency action plan eap evacuation egress blocked exit' },
  { title: 'Field Note: PPE Assessment & Use', path: '/field-notes/ppe-assessment', type: 'Field Note', keywords: 'ppe personal protective equipment assessment hazard glove eye face' },
  { title: 'Field Note: Fall Protection', path: '/field-notes/fall-protection', type: 'Field Note', keywords: 'fall protection 1910.28 1926.501 harness anchor height working' },
  { title: 'Field Note: Confined Space Entry', path: '/field-notes/confined-space', type: 'Field Note', keywords: 'confined space entry permit attendant atmospheric testing' },
  { title: 'Field Note: Scaffolding Safety', path: '/field-notes/scaffolding-safety', type: 'Field Note', keywords: 'scaffolding scaffold 1926.451 inspection assembly user' },
  { title: 'Field Note: Hearing Conservation', path: '/field-notes/hearing-conservation', type: 'Field Note', keywords: 'hearing conservation noise audiometric 90 decibel db' },
  { title: 'Field Note: Bloodborne Pathogens', path: '/field-notes/bloodborne-pathogens', type: 'Field Note', keywords: 'bloodborne pathogen 1910.1030 exposure control plan first aid' },
  { title: 'Field Note: OSHA Recordkeeping & the 300 Log', path: '/field-notes/recordkeeping-300-log', type: 'Field Note', keywords: 'recordkeeping osha 300 log injury illness 301 300a posting' },
  { title: 'Field Note: Respiratory Protection', path: '/field-notes/respiratory-protection', type: 'Field Note', keywords: 'respiratory protection respirator fit test medical clearance n95' },
  { title: 'Field Note: Respirable Crystalline Silica', path: '/field-notes/silica-respirable-crystalline', type: 'Field Note', keywords: 'silica respirable crystalline dust concrete cutting grinding' },
  { title: 'Field Note: Hot Work, Welding & Cutting', path: '/field-notes/hot-work-welding', type: 'Field Note', keywords: 'hot work welding cutting permit fire watch spark' },
  { title: 'Field Note: Abrasive Wheels & Bench Grinders', path: '/field-notes/abrasive-wheels', type: 'Field Note', keywords: 'abrasive wheel bench grinder tongue guard tool rest 1/8 inch' },
  { title: 'Field Note: Portable Ladder Safety', path: '/field-notes/ladder-safety', type: 'Field Note', keywords: 'portable ladder safety angle three points contact extension' },
  { title: 'Field Note: Eye & Face Protection', path: '/field-notes/eye-face-protection', type: 'Field Note', keywords: 'eye face protection safety glasses goggles z87 ansi' },
  { title: 'Field Note: Trenching & Excavation', path: '/field-notes/trenching-excavation', type: 'Field Note', keywords: 'trenching excavation 1926.651 shoring sloping benching protective system' },
  { title: 'Field Note: Overhead Cranes & Rigging', path: '/field-notes/cranes-rigging', type: 'Field Note', keywords: 'overhead crane rigging sling load chart inspection' },
  { title: 'Field Note: NC State Plan vs Federal OSHA', path: '/field-notes/nc-osha-vs-federal', type: 'Field Note', keywords: 'nc north carolina state plan federal osha jurisdiction' },

  // ── Field Notes index ──────────────────────────────────
  { title: 'All Field Notes', path: '/field-notes', type: 'Page', keywords: 'field notes blog articles index list all' },

  // ── Blog posts (long-form pillar guides) ──────────────
  { title: 'Blog: All OSHA Compliance Guides', path: '/blog', type: 'Blog', keywords: 'blog guides articles osha compliance guides field reports index' },
  { title: 'Blog: OSHA 300 Log Common Mistakes', path: '/blog/osha-300-log-common-mistakes-citations', type: 'Blog', keywords: 'osha 300 log 300a 301 recordkeeping mistakes citations first aid medical treatment' },
  { title: 'Blog: Written HazCom Program Before OSHA Inspection', path: '/blog/written-hazcom-program-before-osha-inspection', type: 'Blog', keywords: 'hazcom written program inspection sds ghs labels training 1910.1200' },
  { title: 'Blog: OSHA Forklift Compliance — What Inspectors Check', path: '/blog/osha-forklift-compliance-inspector-checklist', type: 'Blog', keywords: 'forklift 1910.178 operator certification daily inspection log traffic pit' },
  { title: 'Blog: LOTO Program Requirements for Small Facilities', path: '/blog/loto-program-requirements-small-facilities', type: 'Blog', keywords: 'loto lockout tagout 1910.147 machine specific procedure annual inspection' },
  { title: 'Blog: OSHA Machine Guarding Checklist', path: '/blog/osha-machine-guarding-checklist-small-manufacturers', type: 'Blog', keywords: 'machine guarding 1910.212 1910.215 abrasive wheel shear point of operation nip point' },
  { title: 'Blog: HazCom Requirements for Small Businesses', path: '/blog/hazcom-requirements-small-business', type: 'Blog', keywords: 'hazcom requirements 1910.1200 sds ghs labels training small business' },
  { title: 'Blog: Top 5 OSHA Violations in Small Manufacturing', path: '/blog/top-5-osha-violations-small-manufacturing', type: 'Blog', keywords: 'top 5 osha violations small manufacturing most cited citations' },
];
