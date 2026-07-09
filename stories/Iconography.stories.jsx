import React from 'react';
import { ICON_NAMES, Icon } from '../src/index.js';

const LDS_EXTENSION_NAMES = [
  'robot',
  'joystick',
  'waypoint',
  'route',
  'zone',
  'layers',
  'lidar',
  'battery',
  'battery-charging',
  'gauge',
  'signal',
  'crosshair',
  'map',
  'cpu',
  'volume-x',
  'maximize',
  'volume-2',
  'apple',
];

const ldsExtensionSet = new Set(LDS_EXTENSION_NAMES);
const colorIconNames = ICON_NAMES.filter((name) => name.startsWith('color-'));
const baseIconNames = ICON_NAMES.filter((name) => !name.startsWith('color-') && !ldsExtensionSet.has(name));
const roboticsExtensionIconNames = LDS_EXTENSION_NAMES.filter((name) => ICON_NAMES.includes(name));
const counts = {
  ldsLegacyFallbacks: LDS_EXTENSION_NAMES.length,
  publicIconNames: ICON_NAMES.length,
  baseIconNames: baseIconNames.length,
  colorIconNames: colorIconNames.length,
  roboticsExtensionIconNames: roboticsExtensionIconNames.length,
};

const sourceLabel = {
  'base-normal': '기본 일반',
  'base-navigation': '기본 내비게이션',
  'base-color': '기본 컬러',
  'lds-legacy': 'LDS 확장',
};

const meta = {
  title: 'LDS Core/Foundation/Icon',
  parameters: {
    docs: {
      description: {
        component:
          'LDS는 기본 아이콘 세트를 가져오고, 도메인 전용 컨트롤을 위한 소규모 LK ROBOTICS 확장 세트를 유지합니다.',
      },
    },
  },
};

export default meta;

function sourceOf(name) {
  if (ldsExtensionSet.has(name)) return 'lds-legacy';
  if (name.startsWith('color-')) return 'base-color';
  if (name.startsWith('nav-')) return 'base-navigation';
  return 'base-normal';
}

function IconTile({ name, compact = false }) {
  const source = sourceOf(name);
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: compact ? 7 : 9,
        minHeight: compact ? 88 : 104,
        padding: compact ? '12px 8px' : 14,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
      }}
    >
      <Icon name={name} size={24} />
      <code style={{ fontSize: compact ? 10 : 11, color: 'var(--color-semantic-label-neutral)', textAlign: 'center', lineHeight: 1.35 }}>
        {name}
      </code>
      {!compact && (
        <span style={{ fontSize: 10, color: 'var(--color-semantic-label-alternative)', textAlign: 'center' }}>
          {sourceLabel[source] || source}
        </span>
      )}
    </div>
  );
}

export const IconSizingAndColor = {
  name: '아이콘 크기와 색상',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(760px, 100%)' }}>
      <section style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', color: 'var(--color-semantic-label-normal)' }}>
        {[16, 20, 24, 32, 40].map((size) => (
          <span key={size} style={{ display: 'inline-grid', gap: 6, justifyItems: 'center', color: 'var(--color-semantic-label-neutral)' }}>
            <Icon name="square" size={size} aria-hidden="true" />
            <code style={{ fontSize: 11 }}>{size}</code>
          </span>
        ))}
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--color-semantic-label-normal)' }}><Icon name="document" size={24} aria-hidden="true" /></span>
        <span style={{ color: 'var(--color-semantic-primary-normal)' }}><Icon name="bookmark" size={24} aria-hidden="true" /></span>
        <span style={{ color: 'var(--color-semantic-status-positive)' }}><Icon name="circle-check" size={24} aria-hidden="true" /></span>
        <span style={{ color: 'var(--color-semantic-status-negative)' }}><Icon name="triangle-exclamation" size={24} aria-hidden="true" /></span>
      </section>
    </main>
  ),
};

export const IconRegistry = {
  name: '기본 아이콘 레지스트리',
  render: () => {
    return (
      <main style={{ width: 'min(1040px, 100%)', display: 'grid', gap: 18 }}>
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 8,
          }}
        >
          <div style={{ padding: 14, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>기본 아이콘 이름</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.baseIconNames}</strong>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>컬러 아이콘 페이지 소속</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.colorIconNames}</strong>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>로보틱스 아이콘 페이지 소속</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.roboticsExtensionIconNames}</strong>
          </div>
        </section>
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))',
            gap: 10,
          }}
        >
          {baseIconNames.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </section>
      </main>
    );
  },
};

export const ColorBrandIcons = {
  name: '컬러 브랜드 아이콘',
  render: () => {
    return (
      <main style={{ width: 'min(920px, 100%)', display: 'grid', gap: 16 }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))', gap: 10 }}>
          {colorIconNames.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </section>
      </main>
    );
  },
};

export const RoboticsExtensionIcons = {
  name: '로보틱스 확장 아이콘',
  render: () => {
    return (
      <main style={{ width: 'min(920px, 100%)', display: 'grid', gap: 16 }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))', gap: 10 }}>
          {roboticsExtensionIconNames.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </section>
      </main>
    );
  },
};

export const IconCard = {
  name: 'Icon card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div
      data-visual-crop-root
      style={{
        width: 780,
        height: 460,
        background: 'var(--bw-paper)',
        padding: 24,
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: 'var(--color-semantic-primary-normal)',
          }}
        >
          Iconography
        </span>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>
          {ICON_NAMES.length} base glyphs plus LDS extensions
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(94px, 1fr))', gap: 4 }}>
        {ICON_NAMES.slice(0, 72).map((name) => (
          <IconTile key={name} name={name} compact />
        ))}
      </div>
    </div>
  ),
};
