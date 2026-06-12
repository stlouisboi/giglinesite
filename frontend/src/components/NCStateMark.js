import React from 'react';

/**
 * NCStateMark — recognizable NC silhouette.
 *
 * ~2.2:1 aspect ratio (vs real ~3.3:1) — slightly compressed so the state
 * stays legible at icon sizes (24–40px wide). Captures the key features:
 *   • pointed western tip (Smoky Mountains panhandle extending left)
 *   • mostly-straight northern border with VA
 *   • Outer Banks bulge on the eastern coast
 *   • angled SE corner sloping toward the southern point
 */
const NCStateMark = ({
  width = 36,
  className = '',
  fill = '#1F6FEB',
  starFill = '#F2D072',
  showStar = true,
  ariaLabel = 'North Carolina — Kernersville',
}) => {
  // Native viewBox aspect: 220 × 100 ≈ 2.2:1
  const height = (width * 100) / 220;
  return (
    <svg
      viewBox="0 0 220 100"
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
      className={className}
      data-testid="nc-state-mark"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      <path
        d="
          M 6,58
          L 4,62
          L 12,67
          L 26,68
          L 42,67
          L 54,64
          L 60,55
          L 66,44
          L 74,34
          L 86,26
          L 102,20
          L 122,16
          L 144,14
          L 166,15
          L 184,19
          L 198,24
          L 208,30
          L 213,38
          L 210,44
          L 215,50
          L 208,54
          L 213,60
          L 206,66
          L 196,71
          L 188,76
          L 184,84
          L 176,92
          L 162,95
          L 146,93
          L 128,90
          L 108,86
          L 88,82
          L 72,78
          L 58,74
          L 46,70
          L 32,67
          L 20,64
          Z
        "
        fill={fill}
        stroke="#04101F"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {showStar && (
        <g transform="translate(118, 50)">
          {/* Halo for contrast against state fill */}
          <circle cx="0" cy="0" r="7" fill="#FFFFFF" opacity="0.25" />
          <polygon
            points="0,-6 1.65,-1.85 6,-1.85 2.5,0.7 3.8,5.2 0,2.6 -3.8,5.2 -2.5,0.7 -6,-1.85 -1.65,-1.85"
            fill={starFill}
            stroke="#3A2810"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
};

export default NCStateMark;
