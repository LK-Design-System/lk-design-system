import { StepList } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Step List',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-step-list--step-list-steps',
      eyebrow: 'Core / Content / Step List',
      title: '순서가 있는 절차와 각 단계의 보조 설명을 함께 보여줍니다',
      description:
        '설정, 검토, 게시처럼 사용자가 순서를 이해해야 하는 짧은 절차를 안내할 때 적합합니다. 현재 진행 상태를 강조해야 하면 Stepper를, 시간순 사건 기록에는 Timeline을 사용하고 서로 독립적인 할 일을 억지로 단계로 묶지 마세요.',
    },
    docs: {
      description: {
        component: '순서가 있는 진행 단계를 제목·설명과 함께 보여주는 StepList 패턴입니다.',
      },
    },
  },
};

export default meta;

// 정식 키는 label / detail 입니다. (title / description 은 호환 별칭으로만 지원)
const steps = [
  { id: 'draft', label: '초안 작성', detail: '필수 항목 확인' },
  { id: 'review', label: '검토 요청', detail: '담당자 지정' },
  { id: 'publish', label: '게시 완료', detail: '변경 이력 기록' },
];

export const StepListSteps = {
  name: '개요',
  parameters: storyDescription(
    '초안 작성부터 검토와 게시까지 순차 절차를 읽는 상황입니다. 단계 번호, 제목, 설명의 연결이 분명하고 좁은 너비에서도 순서와 들여쓰기가 흐트러지지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', maxWidth: 760, minWidth: 0 }}>
      <StepList steps={steps} editable={false} label="게시 절차" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ol');
    if (!list) throw new Error('순서가 있는 절차는 ol/li로 렌더링되어야 합니다(WCAG 1.3.1).');
    const rows = [...list.querySelectorAll(':scope > li')];
    if (rows.length !== steps.length) {
      throw new Error('각 단계는 li 하나로 노출되어야 합니다.');
    }
    for (const step of steps) {
      if (!rows.some((row) => row.textContent.includes(step.label) && row.textContent.includes(step.detail))) {
        throw new Error(`문서 페이지에 단계 텍스트가 렌더링되지 않았습니다: ${step.label}`);
      }
    }
  },
};

export const StepListEditing = {
  name: '변형·상태 · 편집 컨트롤의 접근 이름',
  parameters: storyDescription(
    '재정렬과 삭제 버튼이 붙은 편집 모드입니다. 행마다 버튼 이름이 단계 이름을 포함해 서로 구분되는지(WCAG 2.4.6) 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 520, minWidth: 0 }}>
      <StepList steps={steps} label="편집 가능한 게시 절차" onChange={() => {}} onAdd={() => {}} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const names = [...canvasElement.querySelectorAll('li button')].map((b) => b.getAttribute('aria-label'));
    if (new Set(names).size !== names.length) {
      throw new Error('행 컨트롤의 aria-label이 행마다 중복됩니다 — 단계 이름을 포함해야 합니다(WCAG 2.4.6).');
    }
    if (!names.every((name) => steps.some((step) => name.startsWith(step.label)))) {
      throw new Error('행 컨트롤의 aria-label은 해당 단계 이름으로 시작해야 합니다.');
    }
  },
};
