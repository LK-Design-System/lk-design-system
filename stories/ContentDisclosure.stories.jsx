import {
  Accordion,
  Code,
  Collapsible,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Disclosure',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-disclosure--disclosure',
      eyebrow: 'Core / Content / Disclosure',
      title: '필요할 때만 상세 정보를 펼쳐 기본 흐름을 간결하게 유지합니다',
      description:
        'FAQ, 선택적 설명, 상세 로그처럼 모든 사용자가 즉시 읽을 필요가 없는 보조 콘텐츠에 적합합니다. 과업 완료에 필수인 정보나 오류는 접지 말고 바로 노출하며, 화면 이동이 필요한 계층 탐색에는 Navigation을 사용하세요.',
    },
    docs: {
      description: {
        component: '긴 설명이나 상세 로그를 접었다 펼치는 Accordion, Collapsible 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Disclosure = {
  name: '개요',
  parameters: storyDescription(
    '질문 묶음과 상세 로그를 초기 상태에 맞춰 접거나 펼치는 상황입니다. 트리거의 제목만으로 내부 내용을 예측할 수 있고 열린 상태, 키보드 조작, 펼친 콘텐츠의 읽기 순서가 명확한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
      <Accordion
        defaultOpen={[0]}
        items={[
          { title: '토큰을 왜 먼저 봐야 하나요?', content: '색상, 간격, 모션은 컴포넌트보다 먼저 공유되는 기준입니다.' },
          { title: '컴포넌트는 어떻게 검증하나요?', content: 'Storybook에서 상태별로 렌더링하고 실제 예시 화면에서 조합을 확인합니다.' },
        ]}
      />
      <Collapsible title="상세 로그" defaultOpen>
        <Code block>pnpm run check:contracts</Code>
      </Collapsible>
    </main>
  ),
};
