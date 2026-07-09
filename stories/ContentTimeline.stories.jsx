import { Timeline } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Content/Timeline',
  parameters: {
    docs: {
      description: {
        component: '시간 순서로 일어난 이벤트를 상태 색과 함께 읽는 Timeline 패턴입니다.',
      },
    },
  },
};

export default meta;

export const TimelineEvents = {
  name: '타임라인',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <Timeline
        items={[
          { time: '09:12', title: '검토 시작', description: '초안이 담당자에게 전달됨', tone: 'signal' },
          { time: '09:18', title: '수정 요청', description: '설명 문구 보완 필요', tone: 'cautionary' },
          { time: '09:26', title: '게시 완료', description: '변경 이력 기록', tone: 'positive' },
        ]}
      />
    </main>
  ),
};
