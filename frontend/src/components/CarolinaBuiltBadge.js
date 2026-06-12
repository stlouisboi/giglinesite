import React from 'react';

/**
 * CarolinaBuiltBadge — challenge-coin style.
 * NC silhouette is the hero. Bold star at Kernersville. Readable straight-line
 * text labels (no curved micro-text). Designed to read at 80-140px display sizes.
 *
 * Zero third-party trademark exposure — stylized state outline, generic star,
 * generic Navy-veteran foul anchor.
 */
const CarolinaBuiltBadge = ({
  size = 120,
  className = '',
  ariaLabel = 'Carolina-Built, Veteran-Owned — Kernersville, NC',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={ariaLabel}
      className={className}
      data-testid="carolina-built-badge"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <defs>
        {/* Outer ring — dark navy → black radial */}
        <radialGradient id="cb-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#102A43" />
          <stop offset="100%" stopColor="#04101F" />
        </radialGradient>

        {/* Inner field — Carolina blue glow */}
        <radialGradient id="cb-inner" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#2E86F0" />
          <stop offset="100%" stopColor="#1558C0" />
        </radialGradient>

        {/* Gold gradient — for ring, star, and accents */}
        <linearGradient id="cb-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F6D679" />
          <stop offset="50%" stopColor="#D4A93E" />
          <stop offset="100%" stopColor="#9B7820" />
        </linearGradient>

        {/* Subtle white inner glow on NC silhouette */}
        <linearGradient id="cb-state" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8EEF7" />
        </linearGradient>
      </defs>

      {/* OUTER COIN */}
      <circle cx="100" cy="100" r="96" fill="url(#cb-bg)" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="url(#cb-gold)" strokeWidth="3" />
      {/* Inner gold pinstripe */}
      <circle cx="100" cy="100" r="88" fill="none" stroke="url(#cb-gold)" strokeWidth="1" opacity="0.55" />

      {/* TOP LABEL — horizontal, readable */}
      <text
        x="100"
        y="32"
        textAnchor="middle"
        fill="#F6D679"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="14"
        fontWeight="800"
        letterSpacing="3"
      >
        CAROLINA
      </text>
      <text
        x="100"
        y="48"
        textAnchor="middle"
        fill="#F6D679"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="14"
        fontWeight="800"
        letterSpacing="3"
      >
        BUILT
      </text>

      {/* INNER CIRCULAR FIELD — blue */}
      <circle cx="100" cy="108" r="56" fill="url(#cb-inner)" />
      <circle cx="100" cy="108" r="56" fill="none" stroke="#04101F" strokeWidth="1" opacity="0.5" />

      {/*
        NC STATE SILHOUETTE — more faithful proportions.
        viewBox slot: x≈42→160 (118 wide), y≈98→118 (20 tall) — 5.9:1 ratio matches real NC.
        Key features:
          • sharp western point (Smoky Mountains panhandle) at left
          • long mostly-horizontal body
          • slight Outer Banks bulge on the east
          • south edge angled slightly downward toward the east
      */}
      <g>
        <path
          d="
            M 44,114
            L 50,109
            L 58,106
            L 70,103
            L 86,101
            L 104,100
            L 122,100
            L 138,101
            L 150,103
            L 156,105
            L 158,108
            L 154,109
            L 159,111
            L 156,113
            L 150,114
            L 144,114
            L 134,116
            L 120,117
            L 104,118
            L 88,118
            L 72,117
            L 60,116
            L 52,116
            Z
          "
          fill="url(#cb-state)"
          stroke="#04101F"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/*
          KERNERSVILLE STAR — central-western Piedmont.
          On this silhouette, Kernersville sits at roughly x=108, y=110.
          Big, gold, with dark outline for contrast against white state.
        */}
        <g transform="translate(108, 110)">
          {/* Subtle halo */}
          <circle cx="0" cy="0" r="6.5" fill="#1558C0" opacity="0.35" />
          <polygon
            points="0,-7 1.9,-2.2 7,-2.2 2.9,1 4.5,6.2 0,3 -4.5,6.2 -2.9,1 -7,-2.2 -1.9,-2.2"
            fill="url(#cb-gold)"
            stroke="#3A2810"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </g>

        {/* Small text marker right of the star */}
        <text
          x="120"
          y="113"
          fill="#04101F"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="6.5"
          fontWeight="800"
          letterSpacing="0.5"
        >
          KVL
        </text>
      </g>

      {/* DIVIDER LINES with gold dots */}
      <line x1="38" y1="170" x2="80" y2="170" stroke="#F6D679" strokeWidth="0.9" opacity="0.6" />
      <line x1="120" y1="170" x2="162" y2="170" stroke="#F6D679" strokeWidth="0.9" opacity="0.6" />
      <circle cx="100" cy="170" r="1.6" fill="#F6D679" />

      {/* BOTTOM LABEL — Navy anchor + VETERAN-OWNED */}
      <g transform="translate(100, 184)">
        {/* Foul anchor — clean, generic Navy reference */}
        <g transform="translate(-32, 0) scale(0.9)" fill="none" stroke="#F6D679" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="-8" r="2" fill="#F6D679" stroke="none" />
          <line x1="0" y1="-6" x2="0" y2="5" />
          <line x1="-4.5" y1="-2.5" x2="4.5" y2="-2.5" />
          <path d="M -7,3 Q -7,8 0,8 Q 7,8 7,3" />
        </g>
        <text
          x="6"
          y="3"
          textAnchor="start"
          fill="#F6D679"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="11"
          fontWeight="800"
          letterSpacing="2"
        >
          VET-OWNED
        </text>
      </g>
    </svg>
  );
};

export default CarolinaBuiltBadge;
