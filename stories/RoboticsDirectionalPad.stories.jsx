import React from 'react';
import { DirectionalPad } from '../src/index.js';

const meta = {
  title: 'LDS Robotics/Robotics/Directional Pad',
  parameters: {
    docs: {
      description: {
        component: 'PTZ·짐벌·조그 제어용 momentary D-pad 패턴입니다. 탭은 1회 스텝, 홀드는 rate Hz 반복, 아날로그 이동은 조이스틱 패턴을 씁니다.',
      },
    },
  },
};

export default meta;

const stageStyle = {
  display: 'grid',
  gap: 'var(--space-4)',
  justifyItems: 'start',
  fontFamily: 'var(--font-sans)',
};

const sampleActionStyle = {
  minWidth: 180,
  fontSize: 12,
  color: 'var(--color-semantic-label-alternative)',
  fontVariantNumeric: 'tabular-nums',
};

const sampleLabelStyle = {
  margin: 0,
  fontSize: 12,
  fontWeight: 'var(--fw-semibold)',
  color: 'var(--color-semantic-label-alternative)',
};

function PadSample({ title, children }) {
  return (
    <figure style={{ display: 'grid', gap: 'var(--space-2)', margin: 0, justifyItems: 'center' }}>
      {children}
      <figcaption style={sampleLabelStyle}>{title}</figcaption>
    </figure>
  );
}

export const DirectionalPads = {
  name: '방향 패드',
  render: () => {
    const [log, setLog] = React.useState('대기');
    return (
      <main style={stageStyle}>
        <DirectionalPad
          onStep={(direction) => setLog(`step: ${direction}`)}
          onCenter={() => setLog('home')}
          rate={6}
        />
        <code style={sampleActionStyle}>{log}</code>
      </main>
    );
  },
};

export const States = {
  name: '패드 상태',
  render: () => (
    <main style={{ ...stageStyle, display: 'flex', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
      <PadSample title="기본">
        <DirectionalPad onStep={() => {}} onCenter={() => {}} />
      </PadSample>
      <PadSample title="비활성">
        <DirectionalPad onStep={() => {}} onCenter={() => {}} disabled />
      </PadSample>
      <PadSample title="핸들러 없음">
        <DirectionalPad />
      </PadSample>
    </main>
  ),
};

export const Sizes = {
  name: '패드 크기',
  render: () => (
    <main style={{ ...stageStyle, display: 'flex', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
      <PadSample title="작게">
        <DirectionalPad size={40} onStep={() => {}} onCenter={() => {}} />
      </PadSample>
      <PadSample title="기본">
        <DirectionalPad onStep={() => {}} onCenter={() => {}} />
      </PadSample>
      <PadSample title="크게">
        <DirectionalPad size={60} onStep={() => {}} onCenter={() => {}} />
      </PadSample>
    </main>
  ),
};
