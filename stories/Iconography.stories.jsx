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
  'base-normal': 'Base normal',
  'base-navigation': 'Base navigation',
  'base-color': 'Base color',
  'lds-legacy': 'LDS extension',
};

const meta = {
  title: 'LDS Core/Foundation/Icon',
  parameters: {
    docs: {
      description: {
        component:
          'LDS imports the base icon set, then keeps a small LK Robotics extension set for domain-specific controls.',
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

export const IconSizingAndColor = {
  name: 'Icon sizing and color',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(760px, 100%)' }}>
      <section style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', color: 'var(--label-normal)' }}>
        {[16, 20, 24, 32, 40].map((size) => (
          <span key={size} style={{ display: 'inline-grid', gap: 6, justifyItems: 'center', color: 'var(--label-neutral)' }}>
            <Icon name="square" size={size} aria-hidden="true" />
            <code style={{ fontSize: 11 }}>{size}</code>
          </span>
        ))}
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--label-normal)' }}><Icon name="document" size={24} aria-hidden="true" /></span>
        <span style={{ color: 'var(--color-accent)' }}><Icon name="bookmark" size={24} aria-hidden="true" /></span>
        <span style={{ color: 'var(--color-positive)' }}><Icon name="circle-check" size={24} aria-hidden="true" /></span>
        <span style={{ color: 'var(--color-danger)' }}><Icon name="triangle-exclamation" size={24} aria-hidden="true" /></span>
      </section>
    </main>
  ),
};

export const IconRegistry = {
  name: 'Base icon registry',
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
            <div style={{ fontSize: 12, color: 'var(--label-alternative)' }}>Base icon names</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.baseIconNames}</strong>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--label-alternative)' }}>Color icon page owns</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 24 }}>{counts.colorIconNames}</strong>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--label-alternative)' }}>Robotics icon page owns</div>
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
  name: 'Color brand icons',
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
  name: 'Robotics extension icons',
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
            color: 'var(--lk-accent-ink)',
          }}
        >
          Iconography
        </span>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--label-alternative)' }}>
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
