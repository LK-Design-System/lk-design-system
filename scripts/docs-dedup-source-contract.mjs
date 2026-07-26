/**
 * Keep the Docs page summary while preventing story-bound blocks from reintroducing
 * the same story content into the document surface.
 */
export function assertDocsDedupSourceContract(previewSource) {
  const retainedStoryBlocks = [
    /<DocsStory\b/.test(previewSource) && 'DocsStory',
    /<Controls(?:\s|\/|>)/.test(previewSource) && 'Controls',
    /<Description\b[^>]*\bof\s*=/.test(previewSource) && 'Description with an of prop',
  ].filter(Boolean);

  if (retainedStoryBlocks.length > 0) {
    throw new Error(
      `Docs dedup source contract failed: GuideDocsPage still renders ${retainedStoryBlocks.join(' and ')}.`,
    );
  }

  if (!/<Description\s*\/>/.test(previewSource)) {
    throw new Error(
      'Docs dedup source contract failed: GuideDocsPage must retain the bare <Description /> page summary.',
    );
  }
}
