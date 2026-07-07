import React from 'react';
import { Button, Card, Icon } from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/4 Content/Card',
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
        component: 'Card의 기본 구조, 그림자 단계, 인터랙티브 상태를 확인합니다.',
      },
    },
  },
};

export default meta;

export const Playground = {
  name: '플레이그라운드',
  render: (args) => (
    <Card {...args} style={{ maxWidth: 420 }}>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Icon name="document" size={24} />
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
              항목 상태 패널
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--body2-size)' }}>
              검토 중, compact mode
            </p>
          </div>
        </div>
        <Button size="sm" variant={args.dark ? 'on-dark' : 'primary'}>
          상세 열기
        </Button>
      </div>
    </Card>
  ),
};

export const Elevation = {
  name: '그림자 단계',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 920 }}>
      {['none', 'sm', 'md', 'lg'].map((elevation) => (
        <Card key={elevation} elevation={elevation}>
          <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{elevation}</strong>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--body2-size)' }}>
            component card shadow 토큰을 사용합니다.
          </span>
        </Card>
      ))}
    </div>
  ),
};

export const InteractiveAndDark = {
  name: '인터랙티브와 다크',
  parameters: {
    backgrounds: { default: 'Base' },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Card interactive>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            인터랙티브 light card
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            hover 상태는 `--component-card-shadow-lg`와 `--component-card-hover-transform`을 사용합니다.
          </p>
        </div>
      </Card>
      <Card dark interactive>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-on-dark)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
            인터랙티브 dark card
          </h3>
          <p style={{ margin: 0, color: 'var(--text-on-dark-muted)' }}>
            inverse card 값은 component token으로 제어합니다.
          </p>
        </div>
      </Card>
    </div>
  ),
};
