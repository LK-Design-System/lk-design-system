import React from 'react';
import { NavigationStateGlyph } from '../components/robotics/_NavigationStateGlyph.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// These render the real NavigationStateGlyph — no hand-drawn geometry. In
// production each glyph sits inside a marker's badge circle (see Facility Glyph
// › 상태 표기 for the composed, in-context badge); here we show the raw glyph
// asset so the 11-shape set can be reviewed and regression-tested on its own.
const GLYPH = 'var(--color-semantic-label-strong)';

// All 11 NavigationStateGlyph kinds, labelled from their canonical consumers
// (NAV_STATE_LEGEND + RouteOverlay STATUS_LABEL). A few kinds intentionally
// SHARE a glyph shape — the distinction is semantic, carried by marker context
// and badge tone, not by the drawing.
const STATES = [
  { kind: 'unknown', label: '상태 미확인' },
  { kind: 'invalid', label: '데이터 오류' },
  { kind: 'conflict', label: '충돌' },
  { kind: 'closed', label: '폐쇄', note: 'blocked와 같은 "×" 도형' },
  { kind: 'blocked', label: '차단됨', note: 'closed와 같은 "×" 도형' },
  { kind: 'waiting', label: '대기 중' },
  { kind: 'rerouting', label: '경로 재계산 중' },
  { kind: 'active', label: '이동 중' },
  { kind: 'planned', label: '계획됨' },
  { kind: 'completed', label: '완료됨' },
  { kind: 'stale', label: '오래된 데이터' },
];

const meta = {
  title: 'LDS Robotics/Navigation/State Badge',
  component: NavigationStateGlyph,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-state-badge--overview',
      eyebrow: 'Navigation / State Badge',
      title: '상태 글리프는 마커 배지 안에서 진행·오류·가용성을 하나의 도형으로 압축합니다',
      description:
        '설비·경로·차선·웨이포인트 마커의 모서리 배지에 들어가는 작은 상태 지시자입니다. 내부 모듈 NavigationStateGlyph가 Material Symbols(Apache 2.0)에서 가져온 11종의 상태 글리프를 렌더하며 여러 로보틱스 내비게이션 컴포넌트가 공유합니다. 이 페이지는 그 글리프 자산을 그대로(배지 원은 마커가 그리므로 여기선 생략) 나열해 도형 세트를 검토·회귀합니다. 배지 컨텍스트의 실제 합성은 Facility Glyph의 상태 표기 스토리를 참고하세요. 공개 API가 아닌 내부 모듈입니다. 도형 세트의 검토·회귀에 적합하며, 제품 코드에서는 이 모듈 대신 각 내비게이션 오버레이의 상태 prop을 사용하세요.',
    },
    docs: {
      description: {
        component:
          'NavigationStateGlyph의 상태 글리프 11종을 실제 컴포넌트로 나열합니다. 설비·경로·차선·웨이포인트 마커가 공유하는 내부 자산이며 공개 API가 아닙니다. 배지 원·톤은 마커가 합성하므로 여기서는 글리프 도형만 보여줍니다.',
      },
    },
  },
};

export default meta;

function GlyphTile({ kind, label, note }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 9,
        minHeight: 128,
        padding: 14,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <svg width={40} height={40} viewBox="-12 -12 24 24" aria-hidden="true" style={{ display: 'block' }}>
        <NavigationStateGlyph kind={kind} size={20} color={GLYPH} />
      </svg>
      <code style={{ fontSize: 11, color: 'var(--color-semantic-label-neutral)' }}>{kind}</code>
      <span style={{ fontSize: 11, color: 'var(--color-semantic-label-normal)', textAlign: 'center' }}>{label}</span>
      {note ? (
        <span style={{ fontSize: 10, color: 'var(--color-semantic-label-alternative)', textAlign: 'center' }}>{note}</span>
      ) : null}
    </div>
  );
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '상태 글리프 11종을 실제 컴포넌트로 비교합니다. ~13px 배지 크기에서 각 도형이 서로 구분되는지, invalid/conflict("!")와 closed/blocked("×")처럼 도형을 공유하는 상태쌍이 있는지 확인하세요. 배지 원·톤을 포함한 실제 표기는 Facility Glyph › 상태 표기에서 확인할 수 있습니다.',
  ),
  render: () => (
    <main style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {STATES.map((state) => (
          <GlyphTile key={state.kind} {...state} />
        ))}
      </section>
    </main>
  ),
};
