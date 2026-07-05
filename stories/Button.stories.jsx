import React from 'react';
import { Button, Icon } from '../src/index.js';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Start mission',
    variant: 'primary',
    size: 'md',
    arrow: false,
    full: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'signal', 'dark', 'flat', 'ghost', 'on-dark'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Token-driven action button with variants for brand, dashboard, ghost, and inverse surfaces.',
      },
    },
  },
};

export default meta;

export const Playground = {
  render: (args) => <Button {...args} />,
};

export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {['primary', 'secondary', 'signal', 'dark', 'flat', 'ghost'].map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const SizesAndStates = {
  render: () => (
    <div style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg" arrow>
          Large
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button disabled>Disabled</Button>
        <Button variant="ghost">
          <Icon name="download" size={18} />
          Export
        </Button>
      </div>
      <div style={{ width: 'min(360px, 100%)' }}>
        <Button full variant="signal">
          Full width
        </Button>
      </div>
    </div>
  ),
};

export const OnDark = {
  parameters: {
    backgrounds: { default: 'Navy' },
  },
  render: () => (
    <div style={{ background: 'var(--surface-inverse)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
      <Button variant="on-dark" arrow>
        View telemetry
      </Button>
    </div>
  ),
};
