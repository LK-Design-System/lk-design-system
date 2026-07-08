import {
  Snackbar,
  Toast,
} from '../src/index.js';
import {
  ToastCard as ToastCardStory,
  ToastStackCard as ToastStackCardStory,
} from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Feedback/Toast',
  parameters: {
    docs: {
      description: {
        component: 'Toast, Snackbar 원본에 맞춘 일시적 피드백 패턴입니다.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const ToastNotifications = {
  name: 'Toast variants',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <Section title="Toast 심각도와 아이콘 축">
        <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
          <Toast variant="normal">임시 저장되었습니다.</Toast>
          <Toast variant="positive" action="실행 취소">변경 사항이 게시되었습니다.</Toast>
          <Toast variant="cautionary">일부 필드는 검토가 필요합니다.</Toast>
          <Toast variant="negative" onClose={() => {}}>업로드에 실패했습니다.</Toast>
          <Toast variant="positive" leadingIcon={false}>리딩 아이콘을 끈 상태입니다.</Toast>
        </div>
      </Section>
    </main>
  ),
};

export const SnackbarPatterns = {
  name: 'Snackbar patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <Section title="Snackbar의 heading, description, icon, close button, action 축">
        <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <Snackbar heading="초안이 저장되었습니다" action="보기" onAction={() => {}} />
          <Snackbar description="리포트는 활동 이력에서 복원할 수 있습니다." leadingIcon />
          <Snackbar heading="초대를 보냈습니다" description="구성원에게 곧 이메일이 발송됩니다." leadingIcon closeButton />
          <Snackbar description="네트워크 연결이 불안정합니다." action="다시 시도" closeButton />
        </div>
      </Section>
    </main>
  ),
};

export const ToastCard = { ...ToastCardStory, name: 'Toast card parity', tags: ['!dev', 'visual-parity'] };
export const ToastStackCard = { ...ToastStackCardStory, name: 'ToastStack card parity', tags: ['!dev', 'visual-parity'] };
