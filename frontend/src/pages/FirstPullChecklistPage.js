import React from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import FirstPullChecklistTemplate from '../components/FirstPullChecklistTemplate';
import { FIRST_PULL_CHECKLISTS } from '../data/firstPullChecklists';
import { FIRST_PULL_CHECKLISTS_ENABLED } from '../config/features';
import { isPreviewBypassAllowed } from '../lib/previewGate';

/**
 * /first-pull/:slug page, Phase 2 draft.
 *
 * Gated by FIRST_PULL_CHECKLISTS_ENABLED. When disabled the route redirects
 * to /resources so the checklist is not accessible from public traffic.
 *
 * Owner review bypass: appending ?preview=1 to the URL bypasses the flag
 * ONLY on the private preview / dev hostnames. In production builds on the
 * public giglinecompliance.com hostname the bypass is refused.
 */
const FirstPullChecklistPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const previewBypass = isPreviewBypassAllowed(searchParams.get('preview'));

  if (!FIRST_PULL_CHECKLISTS_ENABLED && !previewBypass) {
    return <Navigate to="/resources" replace />;
  }

  const checklist = FIRST_PULL_CHECKLISTS[slug];
  if (!checklist) {
    return <Navigate to="/resources" replace />;
  }

  return <FirstPullChecklistTemplate checklist={checklist} />;
};

export default FirstPullChecklistPage;
