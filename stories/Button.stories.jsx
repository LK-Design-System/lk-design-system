import React from 'react';
import { Button, Icon } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Action/Button',
  component: Button,
  args: {
    children: '버튼',
    variant: 'solid',
    color: 'primary',
    size: 'medium',
    arrow: false,
    full: false,
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outlined', 'primary', 'secondary', 'signal', 'dark', 'flat', 'ghost', 'on-dark'],
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'assistive'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'LDS Button의 variant, size, disabled, loading, 아이콘, full, 다크 서피스 사용을 확인합니다.',
      },
    },
  },
};

export default meta;

export const Playground = {
  name: 'Playground',
  render: (args) => <Button {...args} />,
};

export const Variants = {
  name: 'Variants',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {['solid', 'outlined'].map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {['primary', 'assistive'].map((color) => (
            <Button key={`${variant}-${color}`} variant={variant} color={color}>
              {variant} {color}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ActionMatrix = {
  name: 'Action matrix',
  render: () => (
    <main style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
      {['large', 'medium', 'small'].map((size) => (
        <section key={size} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="solid" color="primary" size={size}>Primary</Button>
          <Button variant="solid" color="assistive" size={size}>Assistive</Button>
          <Button variant="outlined" color="primary" size={size}>Primary</Button>
          <Button variant="outlined" color="assistive" size={size}>Assistive</Button>
          <Button variant="solid" color="primary" size={size} iconOnly aria-label={`${size} icon only`}>
            <Icon name="plus" size={size === 'small' ? 16 : 18} />
          </Button>
          <Button variant="solid" color="primary" size={size} disable>Disabled</Button>
        </section>
      ))}
    </main>
  ),
};

export const SizesAndStates = {
  name: 'Sizes and states',
  render: () => (
    <div style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button disabled>Disabled</Button>
        <Button loading loadingLabel="저장 중">
          저장 중
        </Button>
        <Button variant="outlined" color="assistive">
          <Icon name="upload" size={18} />
          내보내기
        </Button>
      </div>
      <div style={{ width: 'min(360px, 100%)' }}>
        <Button full variant="solid" color="primary">
          Full width
        </Button>
      </div>
    </div>
  ),
};

export const OnDark = {
  name: 'On dark',
  parameters: {
    backgrounds: { default: 'Navy' },
  },
  render: () => (
    <div style={{ background: 'var(--surface-inverse)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
      <Button variant="on-dark">자세히 보기</Button>
    </div>
  ),
};
