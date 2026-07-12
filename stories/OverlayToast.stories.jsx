import React from 'react';
import { Button, Toast, ToastStack } from '../src/index.js';
import {
  ToastCard as ToastCardStory,
  ToastStackCard as ToastStackCardStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Toast',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-toast--toast-notifications',
      eyebrow: 'Core / Overlay',
      title: 'Toast는 작업을 방해하지 않고 일시적인 상태 변화를 알려줍니다',
      description:
        '저장·게시·업로드처럼 사용자가 이미 시작한 작업의 성공, 주의, 실패 결과를 화면 가장자리에서 잠시 알릴 때 적합합니다. 반드시 읽고 결정해야 하는 내용에는 Alert를, 계속 보존해야 하는 상태에는 Banner를 사용하고 핵심 업무 정보를 Toast에만 의존하지 마세요.',
    },
    docs: {
      description: {
        component: 'Toast 원본에 맞춘 심각도, 아이콘, 액션 축의 일시적 피드백 패턴입니다.',
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

function DurationPolicyDemo() {
  const [visible, setVisible] = React.useState(true);
  const timerRef = React.useRef(null);
  const stopTimer = React.useCallback(() => clearTimeout(timerRef.current), []);
  const startTimer = React.useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 7000);
  }, []);

  React.useEffect(() => {
    if (visible) startTimer();
    return stopTimer;
  }, [startTimer, stopTimer, visible]);

  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start', maxWidth: 680 }}>
      <Button
        variant="outlined"
        color="assistive"
        onClick={() => {
          setVisible(true);
          startTimer();
        }}
      >
        7초 Toast 다시 표시
      </Button>
      {visible && (
        <Toast
          variant="positive"
          onClose={() => setVisible(false)}
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
          onFocus={stopTimer}
          onBlur={startTimer}
        >
          저장되었습니다. 포인터나 초점이 머무는 동안 자동 닫힘이 멈춥니다.
        </Toast>
      )}
      <Toast variant="cautionary" action="검토" onAction={() => {}} onClose={() => {}}>
        검토할 항목이 있어 이 Toast는 자동으로 닫히지 않습니다.
      </Toast>
    </main>
  );
}

export const ToastNotifications = {
  name: '개요',
  parameters: storyDescription(
    'normal·positive·cautionary·negative 심각도와 행동, 닫기, 아이콘 유무를 비교합니다. 색상만으로 상태를 구분하지 않고 메시지와 아이콘이 의미를 보완하며 선택적 행동이 짧고 명확한지 확인하세요.',
  ),
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

export const StackAndPlacement = {
  name: '사용법 · 쌓임 순서와 화면 배치',
  parameters: storyDescription(
    '여러 Toast를 화면 오른쪽 아래에 시간순으로 쌓는 배치 계약입니다. 메시지 간 gap과 가장자리 정렬은 ToastStack이 소유하고 queue 순서·dismiss 상태는 제품이 소유하는지 확인하세요.',
  ),
  render: () => (
    <main
      style={{
        position: 'relative',
        width: 'min(680px, 100%)',
        height: 320,
        overflow: 'hidden',
        border: '1px dashed var(--color-semantic-line-normal-neutral)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-normal-alternative)',
      }}
    >
      <ToastStack position="bottom-right" style={{ position: 'absolute' }}>
        <Toast variant="positive">변경 사항이 저장되었습니다.</Toast>
        <Toast variant="cautionary" action="검토">확인이 필요한 항목이 있습니다.</Toast>
      </ToastStack>
    </main>
  ),
};

export const DurationPolicy = {
  name: '시나리오 · 지속시간과 일시정지',
  parameters: storyDescription(
    '행동 없는 성공 Toast는 7초 뒤 닫히고 hover·focus 동안 타이머를 멈추며, 행동이 있는 주의 Toast는 사용자가 처리할 때까지 유지하는 상황입니다.',
  ),
  render: () => <DurationPolicyDemo />,
};

export const ToastCard = { ...ToastCardStory, name: 'Toast card parity', tags: ['!dev', 'visual-parity'] };
export const ToastStackCard = { ...ToastStackCardStory, name: 'ToastStack card parity', tags: ['!dev', 'visual-parity'] };
