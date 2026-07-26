import React from 'react';
import {
  Callout,
  Link,
  PageHeader,
  Stack,
} from '../src/index.js';
import { storybookManagerHref } from './ComponentGuide.logic.mjs';

export function RelatedPatternLinks({ patterns }) {
  if (!patterns?.length) return null;

  return (
    <Callout tone="signal" title="관련 패턴" data-related-patterns>
      <Stack gap="var(--space-2)">
        {patterns.map((pattern) => (
          <span key={pattern.docsId}>
            {pattern.relationship}은{' '}
            <Link
              href={storybookManagerHref(pattern.docsId)}
              target="_parent"
              tone="neutral"
              underline="always"
              data-related-pattern-link
            >
              {pattern.title}
            </Link>
            에서 확인하세요.
          </span>
        ))}
      </Stack>
    </Callout>
  );
}

/**
 * The masthead every Storybook canvas opens with.
 *
 * It delegates to PageHeader rather than re-implementing it. The two had the same contract —
 * eyebrow, title, description — so a private copy meant the surface that teaches the system
 * was framed by markup the system does not ship, and every PageHeader improvement stopped at
 * the documentation's door.
 */
export function StoryGuide({
  eyebrow,
  title,
  description,
  relatedPatterns,
}) {
  return (
    <div
      data-story-guide
      style={{
        display: 'grid',
        gap: relatedPatterns?.length ? 'var(--space-4)' : 0,
      }}
    >
      <PageHeader headingLevel={1} eyebrow={eyebrow} title={title} description={description} />
      <RelatedPatternLinks patterns={relatedPatterns} />
    </div>
  );
}

export function storyDescription(story) {
  return {
    docs: {
      description: {
        story,
      },
    },
  };
}
