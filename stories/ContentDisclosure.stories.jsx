import {
  Accordion,
  Code,
  Collapsible,
} from '../src/index.js';

const meta = {
  title: 'LDS Core/3 Component/4 Content/Disclosure',
  parameters: {
    docs: {
      description: {
        component: '긴 설명이나 상세 로그를 접었다 펼치는 Accordion, Collapsible 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Disclosure = {
  name: '디스클로저',
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
