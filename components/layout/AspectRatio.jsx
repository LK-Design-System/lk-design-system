import React from 'react';

/**
 * LK ROBOTICS AspectRatio
 * A ratio-locked box for media, map tiles, previews, and video.
 * Accepts a number or any CSS aspect-ratio string.
 */
export function AspectRatio({ children, ratio = 16 / 9, style, ...rest }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: String(ratio), overflow: 'hidden', ...style }} {...rest}>
      {children}
    </div>
  );
}
