import React from 'react';
import { Button, SecretField } from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/Secret Field',
  component: SecretField,
  parameters: {
    docs: {
      description: {
        component: 'Credential 값을 제한적으로 reveal하고 복사하며 자동으로 다시 숨기는 읽기 전용 field 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RevealAndCopy = {
  name: 'Reveal과 복사',
  render: () => <SecretField label="Access token" value="lk_live_8f21d0c9" revealDurationMs={10000} style={{ maxWidth: 620 }} />,
};

export const DisabledAndRevealPolicy = {
  name: '비활성과 reveal 정책',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <SecretField label="복사 전용 secret" value="lk_live_8f21d0c9" revealable={false} />
      <SecretField label="사용할 수 없는 secret" value="lk_live_disabled" disabled />
    </main>
  ),
};

export const ControlledAutoHide = {
  name: '제어형 reveal 자동 숨김',
  render: function Example() {
    const [revealed, setRevealed] = React.useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 560 }}>
        <Button variant="outlined" color="assistive" onClick={() => setRevealed(true)}>외부에서 reveal</Button>
        <SecretField label="Controlled access token" value="lk_live_8f21d0c9" revealed={revealed} onRevealChange={setRevealed} revealDurationMs={1200} />
        <output style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>revealed: {String(revealed)}</output>
      </div>
    );
  },
};
