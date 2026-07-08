import {
  Blockquote,
  Code,
  Kbd,
  Overline,
  SourceTag,
} from '../src/index.js';
import { SourceTagCard as SourceTagCardStory } from './Content.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Text',
  parameters: {
    docs: {
      description: {
        component: '본문 강조, 출처, 코드, 단축키처럼 읽기 흐름 안의 텍스트 정보를 구성하는 콘텐츠 요소입니다.',
      },
    },
  },
};

export default meta;

export const TextContent = {
  name: '텍스트 콘텐츠',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 760 }}>
      <Overline tone="signal">CONTENT GUIDE</Overline>
      <Blockquote cite="문서 가이드">
        문서 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.
      </Blockquote>
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <SourceTag href="#">Design System</SourceTag>
        <Kbd>CMD K</Kbd>
      </div>
      <Code block>pnpm run check:contracts</Code>
    </main>
  ),
};

export const SourceTagCard = { ...SourceTagCardStory, name: 'SourceTag card parity', tags: ['!dev', 'visual-parity'] };
