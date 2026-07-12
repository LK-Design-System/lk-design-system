import React from 'react';
import { ICON_NAMES, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

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
  title: 'LDS Core/Foundation/Iconography',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-iconography--icon-sizing-and-color',
      eyebrow: 'Foundation / Iconography',
      title: '아이콘은 익숙한 의미를 짧게 보조하고 텍스트를 임의로 대신하지 않습니다',
      description:
        '행동이나 상태를 빠르게 식별할 때 LDS registry의 정해진 이름과 크기를 사용하세요. 의미가 모호한 단독 아이콘에는 접근 가능한 이름이나 보이는 라벨이 필요하며, 임의 SVG와 장식용 색상으로 새 의미를 만들지 않습니다.',
    },
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
  name: '개요',
  parameters: storyDescription(
    '기본 아이콘 크기와 semantic 색상 적용 방식을 비교합니다. 주변 텍스트·컨트롤의 크기에 맞춰 아이콘을 선택하고, 상태 색상은 같은 의미의 semantic token으로만 전달하세요.',
  ),
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
  name: '참조 · 기본 아이콘 목록',
  parameters: storyDescription(
    'LDS가 제공하는 기본 아이콘 이름과 출처를 확인하는 목록입니다. 새 그래픽을 추가하기 전에 같은 의미의 기존 glyph가 있는지 검색하고, 표시 이름과 실제 Icon name이 일치하는지 확인하세요.',
  ),
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
  name: '변형·상태 · 브랜드 색상 아이콘',
  parameters: storyDescription(
    '고유 색상이 식별의 일부인 승인된 브랜드 아이콘 모음입니다. 외부 서비스나 브랜드를 실제로 가리킬 때만 사용하고, 일반 기능·상태 아이콘을 꾸미는 용도로 사용하지 마세요.',
  ),
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

export const IconCard = {
  name: 'Icon card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div
      data-visual-crop-root
      style={{
        width: 780,
        height: 460,
        background: 'var(--color-semantic-background-normal-normal)',
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
