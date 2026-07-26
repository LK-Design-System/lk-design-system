import {
  Icon,
  Notification,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Notification',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-notification--notification-patterns',
      eyebrow: 'Core / Status',
      title: 'Notification은 시간에 따라 쌓이는 상태 변화와 운영 이벤트를 목록으로 전달합니다',
      description:
        '사용자가 나중에 다시 확인할 수 있도록 제목, 설명, 발생 시각, 읽음 상태를 보존해야 하는 알림 센터나 활동 목록에 적합합니다. 잠시 보여주고 사라지는 결과에는 Toast를, 페이지 전체에 즉시 알려야 하는 현재 상태에는 Banner를 사용하세요.',
    },
    docs: {
      description: {
        component: '상태 변화와 운영 이벤트를 목록 형태로 전달하는 Notification 패턴입니다. 일시적인 토스트와 달리 다시 확인할 수 있는 상태 기록이므로 Status 그룹에 둡니다.',
      },
    },
  },
};

export default meta;

export const NotificationPatterns = {
  name: '개요',
  parameters: storyDescription(
    '검토 필요·완료·문서 공유 이벤트를 읽지 않음 상태, tone, 아이콘, 상대 시각과 함께 한 목록에 표시합니다. 각 행의 우선순위와 읽음 차이가 분명하고 제목·설명·시간이 잘리지 않으며 행 전체가 예측 가능한 대상으로 동작하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: '40rem' }}>
      <ul aria-label="알림 목록" style={{ margin: 0, padding: 0, overflow: 'hidden', listStyle: 'none', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
        <li style={{ overflow: 'hidden', borderStartStartRadius: 'calc(var(--radius-lg) - 1px)', borderStartEndRadius: 'calc(var(--radius-lg) - 1px)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
          <Notification
            unread
            tone="cautionary"
            icon={<Icon name="triangle-exclamation" />}
            title="검토 필요"
            description="게시 전 확인해야 할 항목이 있습니다."
            time="2분 전"
            dateTime="2026-07-11T09:58:00+09:00"
            onClick={() => {}}
          />
        </li>
        <li style={{ overflow: 'hidden', borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
          <Notification
            tone="positive"
            icon={<Icon name="circle-check-fill" />}
            title="검토 완료"
            description="컴포넌트 변경 요약이 생성되었습니다."
            time="18분 전"
            dateTime="2026-07-11T09:42:00+09:00"
            onClick={() => {}}
          />
        </li>
        <li style={{ overflow: 'hidden', borderEndStartRadius: 'calc(var(--radius-lg) - 1px)', borderEndEndRadius: 'calc(var(--radius-lg) - 1px)' }}>
          <Notification
            icon={<Icon name="bell" />}
            title="새 문서 공유"
            description="ROBOTICS_PATTERNS 문서가 공유되었습니다."
            time="1시간 전"
            dateTime="2026-07-11T09:00:00+09:00"
            onClick={() => {}}
          />
        </li>
      </ul>
    </main>
  ),
};
