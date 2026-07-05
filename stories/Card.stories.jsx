import React from 'react';
import { Button, Card, Icon } from '../src/index.js';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    elevation: 'md',
    interactive: false,
    dark: false,
  },
  argTypes: {
    elevation: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Token-driven neutral surface for product cards, dashboard panels, and inverse sections.',
      },
    },
  },
};

export default meta;

export const Playground = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 420 }}>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Icon name="robot" size={24} />
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
              AMR status panel
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--body2-size)' }}>
              Connected, mapping mode
            </p>
          </div>
        </div>
        <Button size="sm" variant={args.dark ? 'on-dark' : 'primary'}>
          Open details
        </Button>
      </div>
    </Card>
  ),
};

export const Elevation = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 920 }}>
      {['none', 'sm', 'md', 'lg'].map((elevation) => (
        <Card key={elevation} elevation={elevation}>
          <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{elevation}</strong>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--body2-size)' }}>
            Uses component card shadow tokens.
          </span>
        </Card>
      ))}
    </div>
  ),
};

export const InteractiveAndDark = {
  parameters: {
    backgrounds: { default: 'Subtle' },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Card interactive>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            Interactive light card
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Hover state uses `--component-card-shadow-lg` and `--component-card-hover-transform`.
          </p>
        </div>
      </Card>
      <Card dark interactive>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-on-dark)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            Interactive dark card
          </h3>
          <p style={{ margin: 0, color: 'var(--text-on-dark-muted)' }}>
            Inverse card values are controlled through component tokens.
          </p>
        </div>
      </Card>
    </div>
  ),
};
