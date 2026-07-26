import { userEvent } from 'storybook/test';
import {
  Accordion,
  Code,
  Collapsible,
  Icon,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Disclosure',
  tags: ['autodocs'],
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
        headingLevel={2}
        items={[
          { title: '점검 결과는 언제 갱신되나요?', content: '설비 점검이 완료되면 결과와 확인 시간이 자동으로 갱신됩니다.' },
          { title: '오프라인 설비도 표시되나요?', content: '마지막으로 수신한 상태와 연결이 끊긴 시간을 함께 표시합니다.' },
        ]}
      />
      <Collapsible title="상세 로그" defaultOpen>
        <Code block>14:32:08 · 점검 완료 · 이상 항목 0건</Code>
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
      // The canvas header owns the page h1, so this demo's accordion headers sit at h2.
      if (trigger.parentElement?.tagName !== 'H2') {
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

export const LeadingAndDescription = {
  name: '변형·상태 · 아이콘과 설명',
  parameters: storyDescription(
    '항목마다 선행 아이콘과 제목 아래 한 줄 설명을 붙이는 상황입니다. 아이콘과 설명이 트리거 안에 있어 행 전체가 계속 눌리면서도, 버튼의 접근 이름은 제목에만 고정되고 설명은 이름이 아니라 설명으로 연결되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 720 }}>
      <Accordion
        items={[
          {
            leading: <Icon name="person" size={22} aria-hidden="true" />,
            title: '담당자 배정',
            description: '요청을 받을 사람을 고릅니다.',
            content: '팀과 근무 시간을 기준으로 자동 배정하거나 직접 지정할 수 있습니다.',
          },
          {
            leading: <Icon name="document" size={22} aria-hidden="true" />,
            title: '문서 보관 기간',
            description: '보관 후 자동 삭제까지의 기간입니다.',
            content: '기본 90일이며 정책에 따라 조직 단위로 늘릴 수 있습니다.',
          },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const trigger = canvasElement.querySelector('button[aria-expanded]');
    if (!trigger) throw new Error('트리거를 찾지 못했습니다.');

    // 접근 이름은 제목에만 고정된다 — 장식 아이콘도 설명도 이름에 섞이지 않는다.
    const labelledBy = trigger.getAttribute('aria-labelledby');
    const titleEl = labelledBy && doc.getElementById(labelledBy);
    if (!titleEl || titleEl.textContent.trim() !== '담당자 배정') {
      throw new Error('트리거 접근 이름은 title에만 고정되어야 합니다(아이콘·설명 제외).');
    }
    // 설명은 이름이 아니라 aria-describedby로 연결된다.
    const describedBy = trigger.getAttribute('aria-describedby');
    const descEl = describedBy && doc.getElementById(describedBy);
    if (!descEl || descEl.textContent.trim() !== '요청을 받을 사람을 고릅니다.') {
      throw new Error('설명은 aria-describedby로 연결되어야 합니다.');
    }
    // 설명은 트리거 안에 있어 행 전체가 눌린다.
    if (!trigger.contains(descEl)) {
      throw new Error('설명은 트리거 안에 있어야 행 전체가 눌립니다.');
    }
  },
};
