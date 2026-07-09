import { Snackbar } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Overlay/Snackbar',
  parameters: {
    docs: {
      description: {
        component: 'Snackbar 원본에 맞춘 heading, description, icon, close button, action 축의 일시적 피드백 패턴입니다.',
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

export const SnackbarPatterns = {
  name: 'Snackbar 패턴',
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
