import {
  Icon,
  Notification,
} from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/7 Feedback/Notifications',
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
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Notification
          unread
          icon={<Icon name="triangle-exclamation" />}
          title="검토 필요"
          description="게시 전 확인해야 할 항목이 있습니다."
          time="2분 전"
        />
        <Notification
          icon={<Icon name="circle-check" />}
          title="검토 완료"
          description="컴포넌트 변경 요약이 생성되었습니다."
          time="18분 전"
        />
      </div>
    </main>
  ),
};
