import React from 'react';
import { ICON_NAMES, Icon } from '../src/index.js';

const meta = {
  title: '파운데이션/아이콘',
  parameters: {
    docs: {
      description: {
        component: '핵심 monochrome icon registry입니다. 브랜드 로고는 파운데이션/브랜드에서 확인합니다.',
      },
    },
  },
};

export default meta;

export const IconRegistry = {
  name: '아이콘 레지스트리',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 12, width: 'min(920px, 100%)' }}>
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'grid',
            placeItems: 'center',
            gap: 8,
            minHeight: 92,
            padding: 12,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-card)',
            color: 'var(--label-normal)',
          }}
        >
          <Icon name={name} />
          <code style={{ fontSize: 11, color: 'var(--label-alternative)', textAlign: 'center' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const IconCard = {
  name: 'Icon card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 780, height: 460, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--lk-accent-ink)' }}>Iconography</span>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--label-alternative)' }}>
            {ICON_NAMES.length} glyphs · click a component to use <code>&lt;Icon name=&quot;…&quot; /&gt;</code>
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(94px, 1fr))', gap: 4 }}>
          {ICON_NAMES.map((name) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: '15px 6px', borderRadius: 'var(--radius-lg)', color: 'var(--label-normal)' }}>
              <Icon name={name} size={24} />
              <span style={{ fontSize: 10.5, color: 'var(--label-alternative)', letterSpacing: -0.1, textAlign: 'center' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
