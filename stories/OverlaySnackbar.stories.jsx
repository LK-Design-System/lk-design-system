import { Snackbar } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Snackbar',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-snackbar--snackbar-patterns',
      eyebrow: 'Core / Overlay',
      title: 'Snackbar는 흐름을 막지 않고 짧은 결과와 다음 행동을 알립니다',
      description:
        '사용자 동작 직후 잠시 나타나 결과를 설명하고 보기·다시 시도 같은 하나의 후속 행동을 제공할 때 적합합니다. 여러 알림을 화면 가장자리에 쌓으려면 Toast를, 계속 남아야 하는 상태나 절차 안내에는 Banner나 Callout을 사용하세요.',
    },
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
  name: '개요',
  parameters: storyDescription(
    '제목·설명·아이콘·닫기·후속 행동을 조합한 Snackbar를 비교합니다. 메시지가 짧고 자립적으로 이해되며 행동이 하나로 제한되고 닫기 유무와 관계없이 핵심 결과가 전달되는지 확인하세요.',
  ),
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
