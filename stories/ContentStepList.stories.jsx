import { StepList } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Content/Step List',
  parameters: {
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
  name: '스텝 리스트',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', maxWidth: 760, minWidth: 0 }}>
      <StepList steps={steps} editable={false} />
    </main>
  ),
};
