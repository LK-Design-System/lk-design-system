import { userEvent } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const triggers = [...canvasElement.querySelectorAll('button[aria-expanded]')].filter((b) => b.getAttribute('aria-controls'));
    if (triggers.length !== 3) {
      throw new Error('Disclosure 트리거는 aria-controls로 각자의 패널을 가리켜야 합니다(Accordion 2 + Collapsible 1).');
    }
    for (const trigger of triggers) {
      const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) {
        throw new Error('트리거 aria-controls가 존재하는 패널 id와 연결되지 않았습니다.');
      }
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const inert = panel.hasAttribute('inert');
      if (expanded === inert) {
        throw new Error('접힌 패널만 inert여야 합니다 — 열린 패널은 inert가 없고, 접힌 패널은 inert로 접근성 트리·탭 순서에서 제거되어야 합니다.');
      }
    }
    const accordionTriggers = triggers.filter((t) => !t.textContent.includes('상세 로그'));
    for (const trigger of accordionTriggers) {
      if (trigger.parentElement?.tagName !== 'H3') {
        throw new Error('APG Accordion — 각 헤더 트리거는 heading 요소 안에 있어야 합니다.');
      }
    }
    for (const trigger of triggers) {
      const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
      if (panel.getAttribute('role') !== 'region' || panel.getAttribute('aria-labelledby') !== trigger.id) {
        throw new Error('Accordion과 Collapsible의 패널은 같은 계약(role="region" + aria-labelledby)을 공유해야 합니다.');
      }
    }
    const collapsibleTrigger = triggers.find((t) => t.textContent.includes('상세 로그'));
    await userEvent.click(collapsibleTrigger);
    const collapsedPanel = doc.getElementById(collapsibleTrigger.getAttribute('aria-controls'));
    if (collapsibleTrigger.getAttribute('aria-expanded') !== 'false' || !collapsedPanel.hasAttribute('inert')) {
      throw new Error('접은 뒤 패널은 inert가 되어 탭 포커스·스크린리더에서 빠져야 합니다.');
    }
    await userEvent.click(collapsibleTrigger);
  },
};
