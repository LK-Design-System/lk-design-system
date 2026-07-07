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
const counts = {
  ldsLegacyFallbacks: LDS_EXTENSION_NAMES.length,
  publicIconNames: ICON_NAMES.length,
  svgImported: ICON_NAMES.length - LDS_EXTENSION_NAMES.length,
};

const sourceLabel = {
  'wds-normal': 'WDS normal',
  'wds-navigation': 'WDS navigation',
  'wds-color': 'WDS color',
  'lds-legacy': 'LDS extension',
};

const meta = {
  title: 'WDS Core/1 Theme/Icon',
  parameters: {
    docs: {
      description: {
        component:
          'LDS imports the WDS icon set as the base registry, then keeps a small LK Robotics extension set for domain-specific controls.',
      },
    },
  },
};

export default meta;

function sourceOf(name) {
  if (ldsExtensionSet.has(name)) return 'lds-legacy';
  if (name.startsWith('color-')) return 'wds-color';
  if (name.startsWith('nav-')) return 'wds-navigation';
  return 'wds-normal';
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
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        color: 'var(--label-normal)',
      }}
    >
      <Icon name={name} size={24} />
      <code style={{ fontSize: compact ? 10 : 11, color: 'var(--label-neutral)', textAlign: 'center', lineHeight: 1.35 }}>
        {name}
      </code>
      {!compact && (
        <span style={{ fontSize: 10, color: 'var(--label-alternative)', textAlign: 'center' }}>
          {sourceLabel[source] || source}
        </span>
      )}
    </div>
  );
}

export const IconRegistry = {
  name: 'Icon registry',
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
          <div style={{ padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--label-alternative)' }}>WDS SVG imports</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.svgImported}</strong>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--label-alternative)' }}>Public icon names</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.publicIconNames}</strong>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--label-alternative)' }}>LDS extension fallbacks</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.ldsLegacyFallbacks}</strong>
          </div>
        </section>
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))',
            gap: 10,
          }}
        >
          {ICON_NAMES.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </section>
      </main>
    );
  },
};

export const ColorBrandIcons = {
  name: 'Color brand icons',
  render: () => {
    const names = ICON_NAMES.filter((name) => name.startsWith('color-'));
    return (
      <main style={{ width: 'min(920px, 100%)', display: 'grid', gap: 16 }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))', gap: 10 }}>
          {names.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </section>
      </main>
    );
  },
};

export const RoboticsExtensionIcons = {
  name: 'Robotics extension icons',
  render: () => {
    return (
      <main style={{ width: 'min(920px, 100%)', display: 'grid', gap: 16 }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))', gap: 10 }}>
          {LDS_EXTENSION_NAMES.map((name) => (
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
            color: 'var(--lk-accent-ink)',
          }}
        >
          Iconography
        </span>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--label-alternative)' }}>
          {ICON_NAMES.length} glyphs from WDS plus LDS extensions
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
