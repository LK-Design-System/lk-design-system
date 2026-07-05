import React from 'react';

const toLen = (v) => (typeof v === 'number' ? v + 'px' : v);

/**
 * LK ROBOTICS — Split
 * A two-pane layout (sidebar + main, media + copy). Stacks on mobile and
 * splits at `at` ("md" default, or "lg"). Control the tracks with `template`
 * — e.g. "280px 1fr" (fixed left rail), "1fr 320px" (right rail), "2fr 1fr".
 *
 * <Split template="280px 1fr"><nav/><main/></Split>
 */
export function Split({ children, template = '1fr 1fr', at = 'md', gap, style, ...rest }) {
  const vars = { '--split-template': template };
  if (gap != null) vars['--split-gap'] = toLen(gap);
  return (
    <div className="lk-split" data-at={at === 'lg' ? 'lg' : undefined} style={{ ...vars, ...style }} {...rest}>
      {children}
    </div>
  );
}
