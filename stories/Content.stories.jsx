import {
  Blockquote,
  Code,
  Kbd,
  Overline,
  SourceTag,
} from '../src/index.js';
import { SourceTagCard as SourceTagCardStory } from './Content.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Text Primitives',
  tags: ['autodocs'],
  id: 'lds-core-components-content-text',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-text--text-content',
      eyebrow: 'Core / Content / Text Primitives',
      title: '본문 흐름 안의 인용, 출처, 코드와 단축키를 의미에 맞게 구분합니다',
      description:
        '문서에서 일반 문장과 다른 의미를 가진 인용문, 출처, 코드, 키보드 입력을 정확히 표기할 때 적합합니다. 제목과 본문 위계는 Typography를 사용하고, 긴 코드 편집이나 실행 환경을 이 콘텐츠 요소로 대신하지 마세요.',
    },
    docs: {
      description: {
        component: '본문 강조, 출처, 코드, 단축키처럼 읽기 흐름 안의 텍스트 정보를 구성하는 콘텐츠 요소입니다.',
      },
    },
  },
};

export default meta;

export const TextContent = {
  name: '개요',
  parameters: storyDescription(
    '가이드 문서에서 오버라인, 인용문, 출처 링크, 단축키, 코드 블록을 함께 사용하는 상황입니다. 각 요소의 의미가 모양만이 아니라 적절한 시맨틱과 레이블로 전달되고 본문 읽기 흐름을 끊지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 760 }}>
      <Overline tone="signal">콘텐츠 가이드</Overline>
      <Blockquote cite="문서 가이드">
        문서 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.
      </Blockquote>
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <SourceTag href="#">운영 가이드</SourceTag>
        <Kbd>CMD K</Kbd>
      </div>
      <Code block>robotctl status --cell assembly-a</Code>
    </main>
  ),
};

export const SourceTagCard = { ...SourceTagCardStory, name: 'SourceTag card parity', tags: ['!dev', 'visual-parity'] };
