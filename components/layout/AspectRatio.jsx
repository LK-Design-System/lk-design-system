import React from 'react';

/**
 * LK ROBOTICS — AspectRatio
 * A ratio-locked box (media, map tiles, video). Children fill it; overflow is
 * clipped and corners inherit.
 */
export function AspectRatio({ children, ratio = 16 / 9, style, ...rest }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: String(ratio), overflow: 'hidden', ...style }} {...rest}>
      {children}
    </div>
  );
}
