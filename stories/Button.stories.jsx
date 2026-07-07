import React from 'react';
import { Button, Icon } from '../src/index.js';

const meta = {
  title: 'WDS Core/3 Component/2 Action/Button',
  component: Button,
  args: {
    children: '저장',
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
        component: 'Button의 변형, 크기, 상태, 다크 배경 사용을 확인합니다.',
      },
    },
  },
};

export default meta;

export const Playground = {
  name: '플레이그라운드',
  render: (args) => <Button {...args} />,
};

export const Variants = {
  name: '변형',
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
  name: '크기와 상태',
  render: () => (
    <div style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button size="sm">작게</Button>
        <Button size="md">중간</Button>
        <Button size="lg" arrow>
          크게
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button disabled>비활성</Button>
        <Button variant="ghost">
          <Icon name="download" size={18} />
          내보내기
        </Button>
      </div>
      <div style={{ width: 'min(360px, 100%)' }}>
        <Button full variant="signal">
          전체 너비
        </Button>
      </div>
    </div>
  ),
};

export const OnDark = {
  name: '다크 배경',
  parameters: {
    backgrounds: { default: 'Navy' },
  },
  render: () => (
    <div style={{ background: 'var(--surface-inverse)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
      <Button variant="on-dark" arrow>
        상세 보기
      </Button>
    </div>
  ),
};
