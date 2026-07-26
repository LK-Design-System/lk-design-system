import React from 'react';
import { Callout, Link, Stack } from '../src/index.js';
import { storybookManagerHref } from './ComponentGuide.logic.mjs';
import { storyDescription } from './StoryGuide.shared.jsx';

const DOCS_ID = 'lds-core-foundation-design-token--docs';
const OVERVIEW_ID = 'lds-core-foundation-design-token--overview';

function DesignTokenDocsEntry() {
  const docsHref = storybookManagerHref(DOCS_ID);
  React.useEffect(() => {
    // manager-head handles direct loads. This catches Storybook's later client-side story
    // selection, which otherwise can still reveal this hidden Autodocs support story.
    if (window.parent === window) return;

    try {
      const managerUrl = new URL(window.parent.location.href);
      if (managerUrl.searchParams.get('path') !== `/story/${OVERVIEW_ID}`) return;

      managerUrl.searchParams.set('path', `/docs/${DOCS_ID}`);
      window.parent.location.replace(managerUrl);
    } catch {
      // The fallback link remains usable when this canvas is embedded cross-origin.
    }
  }, []);

  return (
    <Stack as="main" style={{ width: 'min(720px, 100%)', minWidth: 0 }}>
      <Callout tone="signal" title="Design Token은 문서에서 확인합니다" data-canonical-docs-entry>
        토큰 계층과 선택 기준은 하나의 결정 가이드가 소유합니다.{' '}
        <Link href={docsHref} target="_parent" tone="neutral" underline="always">
          Design Token 문서 열기
        </Link>
      </Callout>
    </Stack>
  );
}

async function verifyCanonicalDocsEntry({ canvasElement }) {
  const entry = canvasElement.querySelector('[data-canonical-docs-entry]');
  const link = entry?.querySelector('a');
  if (!entry || link?.getAttribute('target') !== '_parent' || link?.getAttribute('href') !== storybookManagerHref(DOCS_ID)) {
    throw new Error('Design Token의 숨김 Canvas는 정식 Docs 경로를 안내해야 합니다.');
  }
}

const meta = {
  title: 'LDS Core/Foundation/Design Token',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: '토큰 계층, 선택 기준, lifecycle, Figma·CSS·AI 연결 계약입니다.' } },
  },
};

export default meta;
// Autodocs still needs one CSF story, but Design Token has no visual specimen of its own.
// The manager canonicalizes old bookmarks to Docs; a raw iframe keeps this explicit handoff.
export const Overview = {
  name: '개요',
  tags: ['!dev'],
  parameters: storyDescription('Design Token은 문서 전용 Foundation이며 토큰 계층과 선택 기준은 정식 Docs 화면에서 확인합니다.'),
  render: () => <DesignTokenDocsEntry />,
  play: verifyCanonicalDocsEntry,
};
