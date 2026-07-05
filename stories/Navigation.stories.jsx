import React from 'react';
import { Button, Icon, TextButton, TopBar } from '../src/index.js';

const meta = {
  title: 'Components/Navigation',
  component: TopBar,
  parameters: {
    docs: {
      description: {
        component: 'Application shell navigation patterns for product and operations screens.',
      },
    },
  },
};

export default meta;

export const TopBarDefault = {
  render: () => (
    <div style={{ width: 'min(960px, 100%)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)' }}>
      <TopBar
        brand={
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--label-strong)' }}>
            <Icon name="robot" size={22} color="var(--lk-accent-ink)" />
            LK Robotics
          </strong>
        }
        actions={<Button size="sm">New mission</Button>}
      >
        <TextButton>Fleet</TextButton>
        <TextButton>Maps</TextButton>
        <TextButton>Alerts</TextButton>
      </TopBar>
      <div style={{ padding: 24, color: 'var(--label-neutral)' }}>
        Navigation components should keep the shell stable while workflows change underneath.
      </div>
    </div>
  ),
};
