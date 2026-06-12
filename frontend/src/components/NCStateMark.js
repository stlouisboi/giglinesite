import React from 'react';

/**
 * NCStateMark — minimal inline NC silhouette with a Kernersville star.
 * No coin frame. No curved text. Just the state shape, sized to sit cleanly
 * inline with surrounding text.
 *
 * The silhouette honors NC's true ~5.5:1 horizontal aspect ratio with a
 * pointed western tip and a slight Outer Banks bulge on the east coast.
 */
const NCStateMark = ({
  width = 96,
  className = '',
  fill = '#1F6FEB',
  starFill = '#F2D072',
  ariaLabel = 'North Carolina — Kernersville',
}) => {
  // Native aspect ratio of the path below: 116 wide × 20 tall ≈ 5.8:1
  const height = (width * 20) / 116;
  return (
    <svg
      viewBox="0 0 116 20"
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
      className={className}
      data-testid="nc-state-mark"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      {/*
        Stylized NC silhouette.
        Anchored to viewBox so it fills the box with consistent padding.
      */}
      <path
        d="
          M 2,14
          L 8,9
          L 16,6
          L 28,3
          L 44,1.5
          L 62,1
          L 80,1
          L 96,2
          L 108,4
          L 114,6.5
          L 116,9
          L 112,10
          L 116,12
          L 113,14
          L 106,14.5
          L 100,15
          L 88,16.5
          L 72,17.5
          L 56,18
          L 40,17.5
          L 26,17
          L 14,16.5
          L 6,15.5
          Z
        "
        fill={fill}
        stroke="#04101F"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/*
        Kernersville star — roughly central-west Piedmont on this stylized path.
        Coordinates: x≈64, y≈10.
      */}
      <g transform="translate(64, 10)">
        <polygon
          points="0,-2.4 0.66,-0.74 2.4,-0.74 1,0.28 1.5,2 0,1 -1.5,2 -1,0.28 -2.4,-0.74 -0.66,-0.74"
          fill={starFill}
          stroke="#3A2810"
          strokeWidth="0.25"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default NCStateMark;
