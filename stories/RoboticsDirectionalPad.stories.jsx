import React from 'react';
import { DirectionalPad } from '../src/index.js';

const meta = {
  title: 'LDS Robotics/Robotics/Directional Pad',
  parameters: {
    docs: {
      description: {
        component: 'PTZ·짐벌·조그 제어용 D-pad DirectionalPad 패턴입니다. 누르고 있으면 반복 스텝, 탭은 1회. 아날로그 이동은 조이스틱을 씁니다.',
      },
    },
  },
};

export default meta;

export const DirectionalPads = {
  name: '방향 패드',
  render: () => {
    const [log, setLog] = React.useState('대기');
    return (
      <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
        <DirectionalPad onStep={(d) => setLog(`step: ${d}`)} center="HOME" onCenter={() => setLog('home')} rate={6} />
        <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>{log}</code>
      </main>
    );
  },
};
