import React from 'react';
import { loadingPatternGuide } from './PatternGuide.data.mjs';
import { PatternGuide } from './PatternGuide.shared.jsx';

/**
 * Kept as a named adapter for direct consumers while the Docs runtime resolves all patterns
 * through the shared PatternGuide registry.
 */
export function LoadingPatternGuide({ sectionLevel = 2 }) {
  return <PatternGuide pattern={loadingPatternGuide} sectionLevel={sectionLevel} />;
}
