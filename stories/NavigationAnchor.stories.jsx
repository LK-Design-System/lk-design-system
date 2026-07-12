import { Anchor } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Anchor',
  component: Anchor,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-anchor--page-table-of-contents',
      eyebrow: 'Product / Anchor',
      title: '앵커는 긴 페이지 안에서 현재 위치와 이동 경로를 보여줍니다',
      description:
        '문서·설정처럼 한 페이지에 여러 제목이 있고 사용자가 구간을 오갈 때 적합합니다. 제품의 다른 화면으로 이동하는 전역 탐색에는 Anchor 대신 Side Nav나 Top Bar를 사용하세요.',
    },
    docs: {
      description: {
        component: '현재 페이지의 섹션 목차를 담당하는 Anchor 패턴입니다. 하위 섹션은 들여쓰기로 표현하며, 페이지 간 이동은 탐색 레일·하단 탐색이 담당합니다.',
      },
    },
  },
};

export default meta;

export const PageTableOfContents = {
  name: '개요',
  parameters: storyDescription(
    '상위 섹션과 한 단계 들여쓴 하위 섹션이 있는 페이지 목차입니다. 현재 항목과 계층이 읽히고 nav landmark가 명확한 이름을 갖는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 320 }}>
      <Anchor
        aria-label="페이지 내 목차"
        active="#summary"
        style={{ maxWidth: 280 }}
        items={[
          { href: '#summary', label: '요약' },
          { href: '#components', label: '컴포넌트' },
          { href: '#component-tokens', label: '토큰 계약', level: 1 },
          { href: '#history', label: '변경 이력' },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const toc = canvasElement.querySelector('nav[aria-label="페이지 내 목차"]');
    if (!toc) throw new Error('Anchor must expose a named in-page navigation landmark.');
  },
};
