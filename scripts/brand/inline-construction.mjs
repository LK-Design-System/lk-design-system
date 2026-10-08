/**
 * Shared construction of the horizontal (inline/banner) company wordmark unit:
 * the LK mark followed by the Bold 700 `ROBOTICS` outline at a visible height of
 * 1X, aligned to the mark's visible bounds and separated by a mark-width gap.
 *
 * `generate-brand-assets.mjs` emits the company inline lockup from it, and
 * `generate-product-lockups.mjs` recomputes the same unit to prove that the
 * company-endorsed product lockup carries the identical company unit instead of
 * a second copy of the formula.
 */

/** Golden values of the pinned Montserrat Bold 700 v7.222 `ROBOTICS` layout. */
export const INLINE_WORDMARK_EXPECTED = Object.freeze({
  glyphIds: Object.freeze([172, 134, 32, 134, 194, 88, 33, 180]),
  origins: Object.freeze([0, 735, 1579, 2344, 3178, 3796, 4124, 4853]),
  finalAdvance: 5491,
  sourceBounds: Object.freeze([83, -712, 5463, 12]),
});

/**
 * Lay out the inline company wordmark in logo source units.
 *
 * @param {object} options
 * @param {import('opentype.js').Font} options.font pinned inline wordmark font
 * @param {string} options.text wordmark text (`ROBOTICS`)
 * @param {{x:number,y:number,width:number,height:number}} options.markBounds visible LK mark bounds
 * @param {number} options.visibleWordmarkHeightToX wordmark visible height in X
 * @param {number} options.gapToMarkWidth mark-to-wordmark gap as a share of the mark's visible width
 */
export function layoutInlineWordmark({ font, text, markBounds, visibleWordmarkHeightToX, gapToMarkWidth }) {
  const letters = [...text];
  const glyphRows = [];
  const finalAdvance = font.forEachGlyph(
    text,
    0,
    0,
    font.unitsPerEm,
    { kerning: true },
    (glyph, x, y, fontSize) => {
      glyphRows.push({
        letter: letters[glyphRows.length],
        glyphId: glyph.index,
        origin: x,
        d: glyph.getPath(x, y, fontSize).toPathData(3),
      });
    },
  );
  const raw = font.getPath(text, 0, 0, font.unitsPerEm, { kerning: true }).getBoundingBox();
  const sourceBounds = Object.freeze({
    x: raw.x1,
    y: raw.y1,
    width: raw.x2 - raw.x1,
    height: raw.y2 - raw.y1,
  });
  const scale = (markBounds.height * visibleWordmarkHeightToX) / sourceBounds.height;
  const bounds = Object.freeze({
    x: markBounds.x + markBounds.width + markBounds.width * gapToMarkWidth,
    y: markBounds.y,
    width: sourceBounds.width * scale,
    height: sourceBounds.height * scale,
  });
  return Object.freeze({
    letters,
    glyphRows,
    finalAdvance,
    sourceBoundsArray: Object.freeze([raw.x1, raw.y1, raw.x2, raw.y2]),
    sourceBounds,
    scale,
    bounds,
    translateX: bounds.x - sourceBounds.x * scale,
    translateY: bounds.y - sourceBounds.y * scale,
  });
}
