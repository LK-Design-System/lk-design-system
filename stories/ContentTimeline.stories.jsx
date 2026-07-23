import { Timeline } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Timeline',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-timeline--timeline-events',
      eyebrow: 'Core / Content / Timeline',
      title: '시간순 사건과 상태 변화를 하나의 연속된 기록으로 보여줍니다',
      description:
        '검토 이력, 배포 기록, 장비 이벤트처럼 발생 시각과 순서가 중요한 읽기 전용 기록에 적합합니다. 사용자가 완료해야 할 절차는 Step List나 Stepper를, 단순 알림 목록은 List를 사용하고 상태 색만으로 사건의 의미를 구분하지 마세요.',
    },
    docs: {
      description: {
        component: '시간 순서로 일어난 이벤트를 상태 색과 함께 읽는 Timeline 패턴입니다.',
      },
    },
  },
};

export default meta;

export const TimelineEvents = {
  name: '개요',
  parameters: storyDescription(
    '검토 시작, 수정 요청, 게시 완료로 이어지는 사건 기록을 시간순으로 확인하는 상황입니다. 시각, 제목, 설명, 상태 톤이 같은 사건 단위로 읽히고 색 없이도 변화의 의미와 순서를 이해할 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <Timeline
        label="검토 기록"
        items={[
          { time: '09:12', title: '검토 시작', description: '초안이 담당자에게 전달됨', tone: 'signal' },
          { time: '09:18', title: '수정 요청', description: '설명 문구 보완 필요', tone: 'cautionary' },
          { time: '09:26', title: '게시 완료', description: '변경 이력 기록', tone: 'positive' },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ol');
    if (!list || list.querySelectorAll(':scope > li').length !== 3) {
      throw new Error('시간순 사건은 ol/li로 렌더링되어야 순서와 개수가 전달됩니다(WCAG 1.3.1).');
    }
    const stamps = [...list.querySelectorAll('time')];
    if (stamps.length !== 3 || !stamps.every((t) => t.getAttribute('datetime'))) {
      throw new Error('각 시각 표기는 dateTime을 가진 <time> 요소여야 합니다.');
    }
  },
};
