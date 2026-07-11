import {
  Icon,
  Notification,
} from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Feedback/Notifications',
  parameters: {
    docs: {
      description: {
        component: '상태 변화와 운영 이벤트를 목록 형태로 전달하는 Notification 패턴입니다.',
      },
    },
  },
};

export default meta;

export const NotificationPatterns = {
  name: '알림',
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
            icon={<Icon name="circle-check" />}
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
