import { StepList } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Step List',
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

const steps = [
  { title: '초안 작성', description: '필수 항목 확인' },
  { title: '검토 요청', description: '담당자 지정' },
  { title: '게시 완료', description: '변경 이력 기록' },
];

export const StepListSteps = {
  name: '개요',
  parameters: storyDescription(
    '초안 작성부터 검토와 게시까지 순차 절차를 읽는 상황입니다. 단계 번호, 제목, 설명의 연결이 분명하고 좁은 너비에서도 순서와 들여쓰기가 흐트러지지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', maxWidth: 760, minWidth: 0 }}>
      <StepList steps={steps} editable={false} />
    </main>
  ),
};
