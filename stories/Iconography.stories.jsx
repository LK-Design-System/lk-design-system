import React from 'react';
import { ICON_NAMES, Icon } from '../src/index.js';
import { foundationGuideStory } from './FoundationGuide.shared.jsx';
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
        '행동이나 상태를 빠르게 식별할 때 LDS registry의 정해진 이름과 크기를 사용하세요. Icon의 기본값은 장식(aria-hidden)이므로 이름은 감싸는 컨트롤이 제공하고, 글리프 자체가 유일한 정보일 때만 aria-label·title로 이름을 붙입니다. 임의 SVG와 장식용 색상으로 새 의미를 만들지 않습니다.',
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

const a11yPanelStyle = {
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  padding: 'var(--space-5)',
  display: 'grid',
  gap: 'var(--space-3)',
};

const a11yCodeStyle = { fontSize: 12, color: 'var(--color-semantic-label-alternative)', wordBreak: 'break-word' };

const a11yRows = [
  [
    '보이는 텍스트 옆의 보조 글리프',
    '<Icon name="download" />',
    'aria-hidden="true" · 접근성 트리에서 제외',
  ],
  [
    '라벨이 있는 아이콘 전용 컨트롤',
    '<IconButton label="내보내기" icon="download" />',
    '이름은 버튼이 제공 · 글리프는 장식 그대로',
  ],
  [
    '글리프 자체가 유일한 정보',
    '<Icon name="circle-check" aria-label="검증 완료" />',
    'role="img" + 해당 이름으로 승격',
  ],
];

export const IconSizingAndColor = {
  name: '개요',
  parameters: storyDescription(
    '기본 아이콘 크기와 semantic 색상 적용 방식, 그리고 접근성 기본값을 함께 봅니다. 주변 텍스트·컨트롤의 크기에 맞춰 아이콘을 선택하고, 상태 색상은 같은 의미의 semantic token으로만 전달하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(760px, 100%)' }}>
      <section style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', color: 'var(--color-semantic-label-normal)' }}>
        {[16, 20, 24, 32, 40].map((size) => (
          <span key={size} style={{ display: 'inline-grid', gap: 6, justifyItems: 'center', color: 'var(--color-semantic-label-neutral)' }}>
            <Icon name="square" size={size} />
            <code style={{ fontSize: 11 }}>{size}</code>
          </span>
        ))}
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--color-semantic-label-normal)' }}><Icon name="document" size={24} /></span>
        <span style={{ color: 'var(--color-semantic-primary-normal)' }}><Icon name="bookmark" size={24} /></span>
        <span style={{ color: 'var(--color-semantic-status-positive)' }}><Icon name="circle-check" size={24} /></span>
        <span style={{ color: 'var(--color-semantic-status-negative)' }}><Icon name="triangle-exclamation" size={24} /></span>
      </section>

      <section style={a11yPanelStyle}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-strong)' }}>
          접근성 · 장식용이 기본값입니다
        </h2>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          <code style={a11yCodeStyle}>Icon</code>은 별도 지정이 없으면 <code style={a11yCodeStyle}>aria-hidden=&quot;true&quot;</code>로
          렌더되고 <code style={a11yCodeStyle}>role</code>을 붙이지 않습니다. registry key(<code style={a11yCodeStyle}>chevron-right</code>,{' '}
          <code style={a11yCodeStyle}>square</code>)는 접근 가능한 이름으로 노출되지 않습니다 — 파일 이름은 사용자에게 읽어 줄 이름이
          아니기 때문입니다. 위 예시들이 <code style={a11yCodeStyle}>aria-hidden</code>을 적지 않아도 되는 이유입니다.
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {a11yRows.map(([situation, code, result]) => (
            <div
              key={situation}
              style={{
                display: 'grid',
                gap: 4,
                paddingTop: 'var(--space-2)',
                borderTop: '1px solid var(--color-semantic-line-normal-alternative)',
              }}
            >
              <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 14 }}>{situation}</strong>
              <code style={a11yCodeStyle}>{code}</code>
              <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>{result}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7, fontSize: 13 }}>
          아이콘이 옆의 텍스트를 반복한다면 이름을 붙이지 마세요 — 스크린리더가 같은 내용을 두 번 읽습니다. 아이콘 전용
          컨트롤의 이름은 <code style={a11yCodeStyle}>IconButton</code>·<code style={a11yCodeStyle}>Button</code>·
          <code style={a11yCodeStyle}>Fab</code>의 <code style={a11yCodeStyle}>label</code>이 담당합니다. 이름을 붙일 때는 모양이 아니라
          의미를 적습니다(&ldquo;삼각형 느낌표&rdquo;가 아니라 &ldquo;주의&rdquo;).
        </p>
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

export const Guidance = { ...foundationGuideStory('iconography', '참조 · 전체 지침'), name: '참조 · 전체 지침' };
